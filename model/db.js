const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('auth', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

const Instituicoes = sequelize.define('Instituicoes', {
  nome: { type: DataTypes.STRING, allowNull: false },
  cnpj: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false },
});

const UserProfile = sequelize.define('UserProfile', {
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  senha: { type: DataTypes.STRING, allowNull: false },
  nome: { type: DataTypes.STRING, allowNull: false },
  cpf: { type: DataTypes.STRING, allowNull: true },
  validado: { type: DataTypes.BOOLEAN, allowNull: false }
}, {
  timestamps: false
});

const Cargo = sequelize.define('Cargo', {
  cargo: {
    type: DataTypes.STRING, 
    allowNull: false,
    unique: true
  }
}, {
  timestamps: false
});


const UserCargo = sequelize.define('UserCargo', {
  idUserProfiles: {
    type: DataTypes.INTEGER,
    references: {
      model: UserProfile,
      key: 'id'
    }
  }, //oia, aqui você tá fazendo as relaçoes por FK; se fala qual o id q tá relacionando e e depois suas propriedades, além do model q você tá chamando
  idCargo: {
    type: DataTypes.INTEGER,
    references: {
      model: Cargo,
      key: 'id'
    }
  }
}, {
  timestamps: false
});


const Token = sequelize.define('Token', {
  token: { type: DataTypes.STRING, allowNull: false },
  idUserProfiles: { type: DataTypes.INTEGER, allowNull: false },
  expiresAt: { type: DataTypes.DATE, allowNull: false }
}, {
  timestamps: false
});


const EditorChefes = sequelize.define('EditorChefes', {
  idInstituicao: {
    type: DataTypes.INTEGER,
    references: {
      model: Instituicoes,
      key: 'id'
    }
  },
    idUserProfiles: {
      type: DataTypes.INTEGER,
      references: {
        model: UserProfile,
        key: 'id',
      },
      unique: true
    },
    linkLattes: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false }
});


const Admin = sequelize.define('Admin', {
  idInstituicao: {
    type: DataTypes.INTEGER,
    references: {
      model: Instituicoes,
      key: 'id'
    }
  },
    idUserProfiles: {
      type: DataTypes.INTEGER,
      references: {
        model: UserProfile,
        key: 'id',
      },
      unique: true
    },
    linkLattes: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false }
});


const Eventos = sequelize.define('Eventos', {
  idAdmin: {
    type: DataTypes.INTEGER,
    references: {
      model: Admin,
      key: 'id'
    }
  },
  nome: { type: DataTypes.STRING, allowNull: false },
  nomeURL: { type: DataTypes.STRING, allowNull: false },
  descricao: { type: DataTypes.TEXT, allowNull: false },
  assuntoPrincipal: { type: DataTypes.STRING, allowNull: false },
  emailEvento: { type: DataTypes.STRING, allowNull: false },
  dataInicio: { type: DataTypes.DATE, allowNull: true },
  dataFinal: { type: DataTypes.DATE, allowNull: true },
  horarioInicio: { type: DataTypes.TIME, allowNull: true },
  horarioFinal: { type: DataTypes.TIME, allowNull: true },
  manha: { type: DataTypes.BOOLEAN, allowNull: true },
  tarde: { type: DataTypes.BOOLEAN, allowNull: true },
  noite: { type: DataTypes.BOOLEAN, allowNull: true },
  status: { type: DataTypes.STRING, allowNull: true },
  publico: { type: DataTypes.BOOLEAN, allowNull: false },
  formato: { type: DataTypes.STRING, allowNull: false },
  proceedings: { type: DataTypes.BOOLEAN, allowNull: false },
  certificados: { type: DataTypes.BOOLEAN, allowNull: false },
  logo: { type: DataTypes.STRING, allowNull: true },
  inicioSubmissao: { type: DataTypes.DATE, allowNull: true },
  finalSubmissao: { type: DataTypes.DATE, allowNull: true },
  inicioAvaliacao: { type: DataTypes.DATE, allowNull: true },
  finalAvaliacao: { type: DataTypes.DATE, allowNull: true },
  limiteArquivosAutores: { type: DataTypes.INTEGER, allowNull: true },
  limiteAutores: { type: DataTypes.INTEGER, allowNull: true },
  limiteAvaliadores: { type: DataTypes.INTEGER, allowNull: true },
  modeloApresentacao: { type: DataTypes.STRING, allowNull: true}
});


const Ouvintes = sequelize.define('Ouvintes', {
  idUserProfiles: {
    type: DataTypes.INTEGER,
    references: {
      model: UserProfile,
      key: 'id'
    }
  },
  idInstituicao: {
    type: DataTypes.INTEGER,
    references: {
      model: Instituicoes,
      key: 'id'
    }
  },
  curso: { type: DataTypes.STRING, allowNull: false },
  periodo: { type: DataTypes.STRING, allowNull: false },
  presenca: { type: DataTypes.BOOLEAN, allowNull: false }
});

const Convidados = sequelize.define('Convidados', {
  idUserProfiles: {
    type: DataTypes.INTEGER,
    references: {
      model: UserProfile,
      key: 'id'
    }
  },
  funcao: { type: DataTypes.STRING, allowNull: false },
  tempoNecessario: { type: DataTypes.STRING, allowNull: false },
  periodo: { type: DataTypes.STRING, allowNull: false }
});

const Autores = sequelize.define('Autores', {
  idUserProfiles: {
    type: DataTypes.INTEGER,
    references: {
      model: UserProfile,
      key: 'id'
    }
  },
    idInstituicao: {
      type: DataTypes.INTEGER,
      references: {
        model: Instituicoes,
        key: 'id'
      }
    },
    periodo: { type: DataTypes.STRING, allowNull: false },
    apresentador: { type: DataTypes.BOOLEAN, allowNull: false },
    curso: { type: DataTypes.STRING, allowNull: false }
});

const Avaliadores = sequelize.define('Avaliadores', {
  idUserProfiles: {
    type: DataTypes.INTEGER,
    references: {
      model: UserProfile,
      key: 'id'
    }
  },
  idInstituicao: {
    type: DataTypes.INTEGER,
    references: {
      model: Instituicoes,
      key: 'id'
    }
  },
  linkLattes: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false }
});

const Organizadores  = sequelize.define('Organizadores ', {
  idInstituicao: {
    type: DataTypes.INTEGER,
    references: {
      model: Instituicoes,
      key: 'id'
    }
  },
  idUserProfiles: {
    type: DataTypes.INTEGER,
    references: {
      model: UserProfile,
      key: 'id'
    }
  },
  idEventos: {
    type: DataTypes.INTEGER,
    references: {
      model: Eventos,
      key: 'id'
    }
  },
  linkLattes: { type: DataTypes.STRING, allowNull: false },
  periodo: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false }
});

const Chairs = sequelize.define('Chairs', {
  idInstituicao: {
    type: DataTypes.INTEGER,
    references: {
      model: Instituicoes,
      key: 'id'
    }
  },
  idUserProfiles: {
    type: DataTypes.INTEGER,
    references: {
      model: UserProfile,
      key: 'id'
    }
  },
  linkLattes: { type: DataTypes.STRING, allowNull: false },
  periodo: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false }
});

const GrandeAreas = sequelize.define('GrandeAreas', {
  nome: { type: DataTypes.STRING, allowNull: true },
  descricao: { type: DataTypes.STRING, allowNull: true }
});

const Areas = sequelize.define('Areas', {
  idGrandeAreas: {
    type: DataTypes.INTEGER,
    references: {
      model: GrandeAreas,
      key: 'id'
    }
  },
  nome: { type: DataTypes.STRING, allowNull: true },
  descricao: { type: DataTypes.STRING, allowNull: true }
});

const SubAreas = sequelize.define('SubAreas', {
  idAreas: {
    type: DataTypes.INTEGER,
    references: {
      model: Areas,
      key: 'id'
    }
  },
  nome: { type: DataTypes.STRING, allowNull: true },
  descricao: { type: DataTypes.STRING, allowNull: true }
});

const AvaliadorSubAreas = sequelize.define('AvaliadorSubAreas', {
  idAvaliadores: {
    type: DataTypes.INTEGER,
    references: {
      model: Avaliadores,
      key: 'id'
    }
  },
  idSubAreas: {
    type: DataTypes.INTEGER,
    references: {
      model: SubAreas,
      key: 'id'
    }
  }
});

const Especialidades = sequelize.define('Especialidades', {
  idSubAreas: {
    type: DataTypes.INTEGER,
    references: {
      model: SubAreas,
      key: 'id'
    }
  },
  nome: { type: DataTypes.STRING, allowNull: false },
  descricao: { type: DataTypes.STRING, allowNull: false }
});


const CorpoEditoriais = sequelize.define('CorpoEditoriais', {
  nome : { type: DataTypes.STRING, allowNull: false }
});

const CorpoEditorialEventos = sequelize.define('CorpoEditorialEventos', {
  idEventos: {
    type: DataTypes.INTEGER,
    references: {
      model: Eventos,
      key: 'id'
    }
  },
  idCorpoEditoriais: {
    type: DataTypes.INTEGER,
    references: {
      model: CorpoEditoriais,
      key: 'id'
    }
  }
});

const Apoiadores = sequelize.define('Apoiadores', {
  nome: { type: DataTypes.STRING, allowNull: false },
});

const EventApoiadores = sequelize.define('EventApoiadores', {
  idEventos: {
    type: DataTypes.INTEGER,
    references: {
      model: Eventos,
      key: 'id'
    }
  },
  idApoiadores: {
    type: DataTypes.INTEGER,
    references: {
      model: Apoiadores,
      key: 'id'
    }
  }
});

const Onlines = sequelize.define('Onlines', {
  idEventos: {
    type: DataTypes.INTEGER,
    references: {
      model: Eventos,
      key: 'id'
    }
  },
  link: { type: DataTypes.STRING, allowNull: false }
});

const Presenciais = sequelize.define('Presenciais', {
  idEventos: {
    type: DataTypes.INTEGER,
    references: {
      model: Eventos,
      key: 'id'
    }
  },
  cep : { type: DataTypes.STRING, allowNull: true },
  estado : { type: DataTypes.STRING, allowNull: true },
  local : { type: DataTypes.STRING, allowNull: true },
  cidade : { type: DataTypes.STRING, allowNull: true }
});


const CategoriaArquivos = sequelize.define('CategoriasArquivos', {
  nome: { type: DataTypes.STRING, allowNull: true },
  descricao: { type: DataTypes.STRING, allowNull: true }
});

const Arquivos = sequelize.define('Arquivos', {
  idEventos: {
    type: DataTypes.INTEGER,
    references: {
      model: Eventos,
      key: 'id'
    }
  },
  idCategoriaArquivos: {
    type: DataTypes.INTEGER,
    references: {
      model: CategoriaArquivos,
      key: 'id'
    }
  },
  normasPublicacaos: { type: DataTypes.STRING, allowNull: true },
  modeloArquivo: { type: DataTypes.STRING, allowNull: true },
  apresentacao : { type: DataTypes.BOOLEAN, allowNull: true },
  avalicao: { type: DataTypes.BOOLEAN, allowNull: true },
  reenvio: { type: DataTypes.BOOLEAN, allowNull: true }
});

const ArquivoSubmetidos = sequelize.define('ArquivoSubmetidos', {
  idCategoriaArquivos: {
    type: DataTypes.INTEGER,
    references: {
      model: CategoriaArquivos,
      key: 'id'
    }
  },
  idEventos: {
    type: DataTypes.INTEGER,
    references: {
      model: Eventos,
      key: 'id'
    }
  },

  titulo:  { type: DataTypes.STRING, allowNull: false },
  resumo:  { type: DataTypes.STRING, allowNull: true },
  bastract:  { type: DataTypes.STRING, allowNull: true },
  palavrasChaves:  { type: DataTypes.STRING, allowNull: true },
  keyWords:  { type: DataTypes.STRING, allowNull: true },
  arquivoCompleto:  { type: DataTypes.STRING, allowNull: true },
  arquivoSemAutoria:  { type: DataTypes.STRING, allowNull: true },
  status:  { type: DataTypes.BOOLEAN, allowNull: true },

});

const Avaliacoes = sequelize.define('Avaliacoes', {
  idArquivosSubmetidos: {
    type: DataTypes.INTEGER,
    references: {
      model: ArquivoSubmetidos,
      key: 'id'
    }
  },
  idAvaliadores: {
    type: DataTypes.INTEGER,
    references: {
      model: Avaliadores,
      key: 'id'
    }
  },

  comentarioOrg: { type: DataTypes.TEXT, allowNull: false },
  comentarioAluno: { type: DataTypes.TEXT, allowNull: false },
  reenvio: { type: DataTypes.BOOLEAN, allowNull: false },
  media: { type: DataTypes.FLOAT, allowNull: false },
  dataAvaliacao: { type: DataTypes.DATE, allowNull: false },
  notaTema: { type: DataTypes.INTEGER, allowNull: false },
  notaObjetivos: { type: DataTypes.INTEGER, allowNull: false },
  notaRevisaoLeitura: { type: DataTypes.INTEGER, allowNull: false },
  notaConsistencia: { type: DataTypes.INTEGER, allowNull: false },
  notaMetodoPesquisa: { type: DataTypes.INTEGER, allowNull: false },
  notaAnaliseResultados: { type: DataTypes.INTEGER, allowNull: false },
  notaConclusoes: { type: DataTypes.INTEGER, allowNull: false },
  notaContribuicaoCientifica: { type: DataTypes.INTEGER, allowNull: false },
  notaRedacaoOrganizacao: { type: DataTypes.INTEGER, allowNull: false }


});

const AutorArquivos = sequelize.define('AutorArquivos', {
  idAutor: {
    type: DataTypes.INTEGER,
    references: {
      model: Autores,
      key: 'id'
    }
  },
  idArquivo: {
    type: DataTypes.INTEGER,
    references: {
      model: ArquivoSubmetidos,
      key: 'id'
    }
  },
});

const ArquivoEspecialidades = sequelize.define('ArquivoEspecialidades', {
  idArquivo: {
    type: DataTypes.INTEGER,
    references: {
      model: ArquivoSubmetidos,
      key: 'id'
    }
  },

  idEspecialidades: {
    type: DataTypes.INTEGER,
    references: {
      model: Especialidades,
      key: 'id'
    }
  },
});

const RespostasAvaliacoes = sequelize.define('RespostasAvaliacoes', {
  idAvaliadores: {
    type: DataTypes.INTEGER,
    references: {
      model: Avaliadores,
      key: 'id'
    }
  },
  idArquivosSubmetidos: {
    type: DataTypes.INTEGER,
    references: {
      model: ArquivoSubmetidos,
      key: 'id'
    }
  },

  respostas: { type: DataTypes.STRING, allowNull: false }
});

const EventoAvaliadores = sequelize.define('EventoAvaliadores', {
  idEventos: {
    type: DataTypes.INTEGER,
    references: {
      model: Eventos,
      key: 'id'
    }
  },

  idAvaliadores: {
    type: DataTypes.INTEGER,
    references: {
      model: Avaliadores,
      key: 'id'
    }
  },

});

const CertificadosAvaliadores = sequelize.define("CertificadosAvaliadores", {
  idArquivosSubmetidos: {
    type: DataTypes.INTEGER,
    references: {
      model: ArquivoSubmetidos,
      key: "id",
    },
  },
  idAvaliadores: {
    type: DataTypes.INTEGER,
    references: {
      model: Avaliadores,
      key: "id",
    },
  },

  certificado: { type: DataTypes.STRING, allowNull: false },
  dataEmissao: { type: DataTypes.DATE, allowNull: false },
  hash: { type: DataTypes.STRING, allowNull: false }
});


const UserEvento = sequelize.define('UserEvento', {
  idUserProfile: {
    type: DataTypes.INTEGER,
    references: {
      model: UserProfile,
      key: 'id'
    },
    allowNull: false
  },
  idEvento: {
    type: DataTypes.INTEGER,
    references: {
      model: Eventos,
      key: 'id'
    },
    allowNull: false
  },
  cargos: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true
});

  const TokenEventos = sequelize.define('TokenEventos', {
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    idUserProfile: {
        type: DataTypes.INTEGER,
        references: {
          model: UserProfile,
          key: 'id'
        }
      },
    idUserEvento: {
        type: DataTypes.INTEGER,
        references: {
          model: UserEvento,
          key: 'id'
        }
      },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
});




UserProfile.belongsToMany(Cargo, { through: UserCargo, foreignKey: 'idUserProfiles' });
Cargo.belongsToMany(UserProfile, { through: UserCargo, foreignKey: 'idCargo' });

Eventos.hasMany(UserEvento, { foreignKey: 'idEvento' });
UserEvento.belongsTo(Eventos, { foreignKey: 'idEvento' });

UserEvento.belongsTo(Cargo, { foreignKey: 'cargos', targetKey: 'cargo' });
Cargo.hasMany(UserEvento, { foreignKey: 'cargos' });

Admin.belongsTo(UserProfile, { foreignKey: 'idUserProfiles' });  // Admin pertence a um UserProfile
UserProfile.hasOne(Admin, { foreignKey: 'idUserProfiles' });  // Um UserProfile tem um Admin

Admin.hasMany(Eventos, {
  foreignKey: 'idAdmin', // Chave estrangeira que faz referência ao Admin
  sourceKey: 'id' // Chave primária no modelo Admin
});

Eventos.belongsTo(Admin, {
  foreignKey: 'idAdmin', // Chave estrangeira que faz referência ao Admin
  targetKey: 'id' // Chave primária no modelo Admin
});

sequelize.sync();

// Não esqueçam
module.exports = {Admin, CertificadosAvaliadores,UserEvento, TokenEventos,  EventoAvaliadores, RespostasAvaliacoes, ArquivoEspecialidades, AutorArquivos, ArquivoSubmetidos, Avaliacoes, UserProfile, Cargo, Token, UserCargo, Instituicoes, EditorChefes, Eventos, Ouvintes, Areas, SubAreas, GrandeAreas, AvaliadorSubAreas, Especialidades, CorpoEditoriais, CorpoEditorialEventos, Apoiadores, EventApoiadores, Onlines, Presenciais, CategoriaArquivos, Arquivos, Convidados, Autores, Organizadores, Chairs , Avaliadores, sequelize };
