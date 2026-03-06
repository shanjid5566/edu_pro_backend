import swaggerUi from "swagger-ui-express";
declare const swaggerDocument: {
    openapi: string;
    info: {
        title: string;
        version: string;
        description: string;
        contact: {
            name: string;
            email: string;
        };
        license: {
            name: string;
            url: string;
        };
    };
    servers: {
        url: string;
        description: string;
    }[];
    tags: {
        name: string;
        description: string;
    }[];
    components: {
        securitySchemes: {
            BearerAuth: {
                type: string;
                scheme: string;
                bearerFormat: string;
                description: string;
            };
        };
        schemas: {
            Error: {
                type: string;
                properties: {
                    success: {
                        type: string;
                        example: boolean;
                    };
                    message: {
                        type: string;
                        example: string;
                    };
                    error: {
                        type: string;
                    };
                };
            };
            Success: {
                type: string;
                properties: {
                    success: {
                        type: string;
                        example: boolean;
                    };
                    message: {
                        type: string;
                        example: string;
                    };
                    data: {
                        type: string;
                    };
                };
            };
            HealthResponse: {
                type: string;
                properties: {
                    success: {
                        type: string;
                        example: boolean;
                    };
                    message: {
                        type: string;
                        example: string;
                    };
                    data: {
                        type: string;
                        properties: {
                            status: {
                                type: string;
                                example: string;
                            };
                            timestamp: {
                                type: string;
                                format: string;
                                example: string;
                            };
                            uptime: {
                                type: string;
                                example: number;
                            };
                            environment: {
                                type: string;
                                example: string;
                            };
                            version: {
                                type: string;
                                example: string;
                            };
                        };
                    };
                };
            };
        };
    };
    paths: {
        "/health": {
            get: {
                tags: string[];
                summary: string;
                description: string;
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    "500": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
    };
};
export declare const swaggerOptions: {
    customCss: string;
    customSiteTitle: string;
};
export { swaggerUi, swaggerDocument };
//# sourceMappingURL=swagger.d.ts.map