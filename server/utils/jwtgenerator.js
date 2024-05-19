import jwt from "jsonwebtoken";

const jwtGenerator = (userId , res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '2d',
    });
    return token;
};

export default jwtGenerator;