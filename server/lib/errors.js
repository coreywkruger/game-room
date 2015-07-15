/**
 * Authentication Error
 * Missing Auth Keys or invalid Authentication
 */
function AuthenticationError(message) {
	this.code = 401;
	this.message = message;
	this.name = 'AuthenticationError';
	// Use compostion here since using inheritance results in false stack traces.
	this.error = new Error();
	this.type = 'authentication_error';
};

/**
 * Invalid Request Error
 * Missing parameters or invalid parameters
 */
function InvalidRequestError(message) {
	this.code = 422;
	this.message = message;
	this.name = 'InvalidRequestError';
	// Use compostion here since using inheritance results in false stack traces.
	this.error = new Error();
	this.type = 'invalid_request_error';
};

/**
 * Dulplicate Error
 * Duplicate asset found
 */
function DuplicateError(message) {
	this.code = 500;
	this.message = message;
	this.name = 'DuplicateError';
	// Use compostion here since using inheritance results in false stack traces.
	this.error = new Error();
	this.type = 'api_error';
}

/**
 * Not Found Error
 * Asset could not be found
 */
function NotFoundError(message) {
	this.code = 404;
	this.message = message;
	this.name = 'NotFoundError';
	// Use compostion here since using inheritance results in false stack traces.
	this.error = new Error();
	this.type = 'not_found_error';
};

/**
 * API Error
 * API logic failed to do what it intended
 */
function ApiError(message) {
	this.code = 500;
	this.message = message;
	this.name = 'ApiError';
	// Use compostion here since using inheritance results in false stack traces.
	this.error = new Error();
	this.type = 'api_error';
};

/**
 * Database Error
 * An error occurred while reading or writing to permanent storage
 */
function DatabaseError(message, detail) {
	this.message = message;
	this.type = 'database_error';
	// Use compostion here since using inheritance results in false stack traces.
	this.error = new Error();
	this.detail = detail;
	this.name = 'DatabaseError';
	this.code = 500;
};

module.exports = {
	AuthenticationError: AuthenticationError,
	InvalidRequestError: InvalidRequestError,
	NotFoundError: NotFoundError,
	ApiError: ApiError,
	DatabaseError: DatabaseError,
	DuplicateError: DuplicateError
};