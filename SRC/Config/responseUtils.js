// utils/responseUtils.js

/**
 * ════════════════════════════════════════════════════════════════
 *                    📤 RESPONSE UTILITIES
 *              Standardized API Responses
 * ════════════════════════════════════════════════════════════════
 */

/**
 * Success Response (200, 201)
 */
export const successResponse = (res, data = null, message = 'Success', statusCode = 200) => {
    const response = {
        success: true,
        message,
        timestamp: new Date().toISOString(),
    };

    if (data !== null) {
        response.data = data;
    }

    return res.status(statusCode).json(response);
};

/**
 * Created Response (201)
 */
export const createdResponse = (res, data = null, message = 'Resource created successfully') => {
    return successResponse(res, data, message, 201);
};

/**
 * Error Response (400, 404, 500, etc.)
 */
/**
 * Error Response (400, 404, 500, etc.)
 */
export const errorResponse = (res, statusCode = 400, message = 'Error occurred', errors = null) => {
    const response = {
        success: false,
        message,
        timestamp: new Date().toISOString(),
    };
    
    if (errors) {
        response.errors = errors;
    }
    
    return res.status(statusCode).json(response);
};
/**
 * Validation Error Response (422)
 */
export const validationError = (res, errors, message = 'Validation failed') => {
    return res.status(422).json({
        success: false,
        message,
        errors,
        timestamp: new Date().toISOString(),
    });
};

/**
 * Unauthorized Response (401)
 */
export const unauthorizedResponse = (res, message = 'Unauthorized access') => {
    return res.status(401).json({
        success: false,
        message,
        timestamp: new Date().toISOString(),
    });
};

/**
 * Forbidden Response (403)
 */
export const forbiddenResponse = (res, message = 'Access forbidden') => {
    return res.status(403).json({
        success: false,
        message,
        timestamp: new Date().toISOString(),
    });
};

/**
 * Not Found Response (404)
 */
export const notFoundResponse = (res, message = 'Resource not found') => {
    return res.status(404).json({
        success: false,
        message,
        timestamp: new Date().toISOString(),
    });
};

/**
 * Conflict Response (409)
 */
export const conflictResponse = (res, message = 'Resource conflict') => {
    return res.status(409).json({
        success: false,
        message,
        timestamp: new Date().toISOString(),
    });
};

/**
 * Too Many Requests Response (429)
 */
export const tooManyRequestsResponse = (res, message = 'Too many requests. Please try again later.') => {
    return res.status(429).json({
        success: false,
        message,
        timestamp: new Date().toISOString(),
    });
};

/**
 * Server Error Response (500)
 */
export const serverErrorResponse = (res, error = null, message = 'Internal server error') => {
    console.error('❌ Server Error:', error);
    
    const response = {
        success: false,
        message,
        timestamp: new Date().toISOString(),
    };

    // Only show error details in development
    if (process.env.NODE_ENV === 'development' && error) {
        response.error = {
            message: error.message,
            stack: error.stack,
        };
    }

    return res.status(500).json(response);
};

/**
 * Service Unavailable Response (503)
 */
export const serviceUnavailableResponse = (res, message = 'Service temporarily unavailable') => {
    return res.status(503).json({
        success: false,
        message,
        timestamp: new Date().toISOString(),
    });
};

/**
 * Bad Request Response (400)
 */
export const badRequestResponse = (res, message = 'Bad request', errors = null) => {
    return errorResponse(res, 400, message, errors);
};

/**
 * Custom Response (for special cases)
 */
export const customResponse = (res, statusCode, success, message, data = null) => {
    const response = {
        success,
        message,
        timestamp: new Date().toISOString(),
    };

    if (data !== null) {
        response.data = data;
    }

    return res.status(statusCode).json(response);
};

/**
 * Paginated Response (200)
 */
export const paginatedResponse = (res, data, pagination, message = 'Success') => {
    return res.status(200).json({
        success: true,
        message,
        data,
        pagination: {
            page: pagination.page || 1,
            limit: pagination.limit || 10,
            total: pagination.total || 0,
            totalPages: pagination.totalPages || 1,
            hasNext: pagination.hasNext || false,
            hasPrev: pagination.hasPrev || false,
        },
        timestamp: new Date().toISOString(),
    });
};

// Export all functions
export default {
    successResponse,
    createdResponse,
    errorResponse,
    validationError,
    unauthorizedResponse,
    forbiddenResponse,
    notFoundResponse,
    conflictResponse,
    tooManyRequestsResponse,
    serverErrorResponse,
    serviceUnavailableResponse,
    badRequestResponse,
    customResponse,
    paginatedResponse,
};