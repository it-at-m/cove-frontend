/*
 * Copyright (c): it@M - Dienstleister für Informations- und Telekommunikationstechnik
 * der Landeshauptstadt München, 2020
 */
package de.muenchen.cove.filter;

import de.muenchen.cove.ApiGatewayApplication;
import org.apache.commons.codec.Charsets;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.reactive.server.WebTestClient;

import static de.muenchen.cove.TestConstants.SPRING_TEST_PROFILE;


@RunWith(SpringRunner.class)
@SpringBootTest(
        classes = { ApiGatewayApplication.class },
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
@ActiveProfiles(SPRING_TEST_PROFILE)
public class GlobalRequestParameterPollutionFilterTest {

    @Autowired
    private WebTestClient webTestClient;

    @Test
    @WithMockUser()
    public void parameterPollutionAttack() {
        final StringBuilder jsonResponseBody = new StringBuilder();
        webTestClient.get().uri("/api/cove-backend-service/testendpoint?parameter1=testdata_1&parameter2=testdata&parameter1=testdata_2").exchange()
                .expectStatus()
                    .isEqualTo(HttpStatus.BAD_REQUEST)
                .expectBody()
                    .consumeWith(responseBody -> jsonResponseBody.append(new String(responseBody.getResponseBody(), Charsets.UTF_8)));
        Assert.assertTrue(jsonResponseBody.toString().contains("\"message\" : \"parameter pollution\""));
    }

}
