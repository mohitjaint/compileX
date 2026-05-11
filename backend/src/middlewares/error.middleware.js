const errorHandler = (err, req, res, next) => {

    const statusCode = err.status || 500;

    return res.status(statusCode).json({
        statusCode,
        success: false,
        message: err.message || "Internal Server Error",
        errors: err.errors || [],
        data: null
    });
};

export default errorHandler;