const jwt = require('jsonwebtoken');
require('dotenv').config();

const validaAcesso = (req, res, next) => {
    // Obtendo o token do cabeçalho Authorization
    const authHeader = req.headers.authorization;

    console.log('Cabeçalho Authorization:', authHeader); // Adicione esta linha

    // Verifica se o cabeçalho Authorization está presente e tem o formato correto
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    // Extrai o token do cabeçalho Authorization
    const token = authHeader.split(' ')[1];

    console.log('Token extraído:', token); // Adicione esta linha

    // Verifica o token JWT
    jwt.verify(token, process.env.KEY, (err, data) => {
        if (err) {
            return res.status(401).json({ message: 'Token inválido' }); // Status 401 para token inválido
        } else {
            req.user = data; // Se precisar acessar os dados do usuário na próxima função
            next();
        }
    });
}

module.exports = {
    validaAcesso
}
