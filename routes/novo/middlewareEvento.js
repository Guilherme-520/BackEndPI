const jwt = require('jsonwebtoken');
const { TokenEventos, UserEvento, Cargo } = require('../../model/db');

const middlewareEvento = (allowedRoles) => {
  return async (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      // Decodificar o token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      console.log('Token decoded:', req.user);

      // Buscar o token mais recente no banco de dados
      const tokenDoc = await TokenEventos.findOne({
        where: { idUserProfile: req.user.idUserProfile },
        order: [['expiresAt', 'DESC']], // Ordenar pela data de expiração
      });

      // Verificar se o token é válido ou expirou
      if (!tokenDoc || new Date() > tokenDoc.expiresAt) {
        return res.status(401).json({ message: 'Access denied. Token expired or invalid.' });
      }

      // Buscar os registros de UserEvento associados ao usuário
      const userEventos = await UserEvento.findAll({
        where: {
          idUserProfile: req.user.idUserProfile,
        },
        include: {
          model: Cargo, // Incluir os cargos associados
          through: { attributes: [] }, // Excluir dados da tabela intermediária
        },
      });

      if (!userEventos || userEventos.length === 0) {
        return res.status(403).json({ message: 'Access denied. User not associated with any event.' });
      }

      // Extrair os cargos associados
      const userRoles = userEventos.flatMap(evento => 
        evento.Cargos.map(cargo => cargo.cargo)
      );

      console.log('User roles:', userRoles);

      // Verificar se o usuário tem pelo menos uma das roles permitidas
      const hasAccess = userRoles.some(role => allowedRoles.includes(role));

      if (!hasAccess) {
        return res.status(403).json({ message: 'Access denied. Insufficient privileges.' });
      }

      next(); // Continuar para a próxima middleware ou rota
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(400).json({ message: 'Invalid token.', error: error.message });
    }
  };
};

module.exports = middlewareEvento;
