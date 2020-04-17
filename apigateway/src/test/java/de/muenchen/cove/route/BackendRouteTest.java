/*
 * Copyright (c): it@M - Dienstleister für Informations- und Telekommunikationstechnik
 * der Landeshauptstadt München, 2020
 */
package de.muenchen.cove.route;

import com.github.tomakehurst.wiremock.http.HttpHeader;
import com.github.tomakehurst.wiremock.http.HttpHeaders;
import com.github.tomakehurst.wiremock.junit.WireMockClassRule;
import com.github.tomakehurst.wiremock.matching.EqualToPattern;
import de.muenchen.cove.ApiGatewayApplication;
import org.junit.ClassRule;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cloud.contract.wiremock.WireMockSpring;
import org.springframework.http.HttpStatus;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.reactive.server.WebTestClient;

import static de.muenchen.cove.TestConstants.SPRING_TEST_PROFILE;
import static de.muenchen.cove.TestConstants.WIREMOCK_PORT_NUMBER;
import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.getRequestedFor;
import static com.github.tomakehurst.wiremock.client.WireMock.stubFor;
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo;
import static com.github.tomakehurst.wiremock.client.WireMock.verify;


@RunWith(SpringRunner.class)
@SpringBootTest(
        classes = { ApiGatewayApplication.class },
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
@ActiveProfiles(SPRING_TEST_PROFILE)
public class BackendRouteTest {

    /**
     * The port must correspond to the port of the backend route.
     */
    @ClassRule
    public static WireMockClassRule wiremock = new WireMockClassRule(WireMockSpring.options().port(WIREMOCK_PORT_NUMBER));

    @Autowired
    private WebTestClient webTestClient;

    @Before
    public void setup() {
        stubFor(get(urlEqualTo("/remote/endpoint"))
                .willReturn(aResponse()
                        .withStatus(HttpStatus.OK.value())
                        .withHeaders(new HttpHeaders(
                                new HttpHeader("Content-Type", "application/json"),
                                new HttpHeader("WWW-Authenticate", "Bearer realm=\"Access to the staging site\", charset=\"UTF-8\""), // removed by route filter
                                new HttpHeader("Expires", "Wed, 21 Oct 2099 07:28:06 GMT") // removed by route filter
                        ))
                        .withBody("{ \"testkey\" : \"testvalue\" }")));
    }

    @Test
    @WithMockUser()
    public void backendRouteResponse() {
        webTestClient.get().uri("/api/cove-backend-service/remote/endpoint")
                .header("Cookie", "SESSION=5cfb01a3-b691-4ca9-8735-a05690e6c2ec; XSRF-TOKEN=4d82f9f1-41f6-4a09-994a-df99d30d1be9") // removed by default-filter
                .header("X-XSRF-TOKEN", "5cfb01a3-b691-4ca9-8735-a05690e6c2ec") // angular specific -> removed by default-filter
                .header("Content-Type", "application/hal+json")
                .exchange()
                .expectStatus().isEqualTo(HttpStatus.OK)
                .expectHeader().valueMatches("Content-Type", "application/json")
                .expectHeader().doesNotExist("WWW-Authenticate")
                .expectHeader().valueMatches("Expires", "0")
                .expectBody().jsonPath("$.testkey").isEqualTo("testvalue");

        verify(getRequestedFor(urlEqualTo("/remote/endpoint"))
                .withoutHeader("Cookie")
                .withoutHeader("X-SRF-TOKEN")
                .withHeader("Content-Type", new EqualToPattern("application/hal+json")));
    }

}
