/*
 * Copyright (c): it@M - Dienstleister für Informations- und Telekommunikationstechnik
 * der Landeshauptstadt München, 2020
 */
package de.muenchen.cove.filter;

import brave.Tracer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.http.server.reactive.ServerHttpResponseDecorator;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;


/**
 * This class adds the zipkin headers "X-B3-SpanId" and "X-B3-TraceId"
 * to each route response.
 */
@Component
public class DistributedTracingFilter implements GlobalFilter {

    private static final String SPAN_ID_HEADER = "X-B3-SpanId";

    private static final String TRACE_ID_HEADER = "X-B3-TraceId";

    @Autowired
    private Tracer tracer;

    /**
     * This method adds the zipkin headers "X-B3-SpanId" and "X-B3-TraceId"
     * to each response in {@link ServerWebExchange}.
     *
     * @param exchange the current server exchange without zipkin headers
     * @param chain provides a way to delegate to the next filter
     * @return {@code Mono<Void>} to indicate when request processing for adding zipkin headers is complete
     */
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        return chain.filter(exchange).then(Mono.fromRunnable(() -> {
            ServerHttpResponseDecorator decorator = new ServerHttpResponseDecorator(exchange.getResponse());
            MultiValueMap<String, String> headers = decorator.getHeaders();
            headers.set(SPAN_ID_HEADER, tracer.currentSpan().context().spanIdString());
            headers.set(TRACE_ID_HEADER, tracer.currentSpan().context().traceIdString());
        }));
    }

}
