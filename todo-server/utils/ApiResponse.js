class ApiResponse {
    static success(res, data, message = "Success") {
        res.status(200).json({ status: 200, message, data });
    }

    static created(res, data, message = "Resource created") {
        res.status(201).json({ status: 201, message, data });
    }

    static badRequest(res, message = "Bad Request") {
        res.status(400).json({ status: 400, message });
    }

    static unauthorized(res, message = "Unauthorized") {
        res.status(401).json({ status: 401, message });
    }

    static forbidden(res, message = "Forbidden") {
        res.status(403).json({ status: 403, message });
    }

    static notFound(res, message = "Resource not found") {
        res.status(404).json({ status: 404, message });
    }

    static error(res, message = "Internal server error") {
        // Optionally log here in real apps
        res.status(500).json({ status: 500, message });
    }
}

export default ApiResponse;