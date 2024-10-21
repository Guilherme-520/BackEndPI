const jwt = require('jsonwebtoken');
const { TokenEventos, UserEvento } = require('../../model/db');

const middlewareEvento = (allowedRoles) => {
  return async (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      console.log("PASSOU AQUI");
      console.log(req.user);


      // Busca o token mais recente no TokenEventos
      const tokenDoc = await TokenEventos.findOne({
        where: { idUserProfile: req.user.idUserProfile },
        order: [['expiresAt', 'DESC']], // Ordena pela data de expiração, do mais recente para o mais antigo
      });

      // Verifica se o token existe e se está expirado
      if (!tokenDoc || new Date() > tokenDoc.expiresAt) {
        return res.status(401).json({ message: 'Access denied. Token expired or invalid.' });
      }

      // Verifica se o evento foi fornecido na URL
      const userEventos = await UserEvento.findAll({
        where: {
          idUserProfile: req.user.idUserProfile,
          // Se precisar, pode adicionar filtro por nomeURL aqui
        }
      });

      if (!userEventos || userEventos.length === 0) {
        return res.status(403).json({ message: 'Access denied. User not associated with any event.' });
      }

      // Extrai os cargos do usuário associados aos eventos
      const userRoles = userEventos.flatMap(evento => JSON.parse(evento.cargos)); // Caso 'cargos' esteja em formato JSON

      // Verifica se o usuário tem pelo menos uma das roles permitidas
      const hasAccess = userRoles.some(cargo => allowedRoles.includes(cargo));

      if (!hasAccess) {
        return res.status(403).json({ message: 'Access denied. Insufficient privileges.' });
      }

      next();
    } catch (ex) {
      console.error('Token verification error:', ex); // Loga o erro
      res.status(400).json({ message: 'Invalid token.', error: ex.message });
    }
  };
};

module.exports = middlewareEvento;
