/*
 * Copyright (c): it@M - Dienstleister für Informations- und Telekommunikationstechnik
 * der Landeshauptstadt München, 2020
 */
package de.muenchen.cove.controller;

import com.github.tomakehurst.wiremock.junit.WireMockClassRule;
import de.muenchen.cove.ApiGatewayApplication;
import org.junit.ClassRule;
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


@RunWith(SpringRunner.class)
@SpringBootTest(
        classes = { ApiGatewayApplication.class },
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
@ActiveProfiles(SPRING_TEST_PROFILE)
public class PingControllerTest {

    /**
     * The port must correspond to the port of the backend route.
     */
    @ClassRule
    public static WireMockClassRule wiremock = new WireMockClassRule(WireMockSpring.options().port(WIREMOCK_PORT_NUMBER));

    @Autowired
    private WebTestClient webTestClient;

    @Test
    @WithMockUser()
    public void ping() {
        webTestClient.get().uri("/api").exchange()
                .expectStatus()
                    .isEqualTo(HttpStatus.OK.value());
    }

    @Test
    public void pingNotAuthenticated() {
        webTestClient.get().uri("/api").exchange()
                .expectStatus()
                    .isEqualTo(HttpStatus.FOUND);
    }

}
