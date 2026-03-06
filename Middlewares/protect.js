

// protect middleware => protect routes that only logged in users can access
export const protect = (req, res, next) => {
    res.send("Protected Route");
}