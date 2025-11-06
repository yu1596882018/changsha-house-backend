module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'temp',
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      a: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'token',
      },
      b: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '用户名称',
      },
      c: {
        type: DataTypes.STRING(10000),
        allowNull: true,
        comment: '用户信息',
      },
    },
    {
      sequelize,
      tableName: 'temp',
      timestamps: false,
    }
  )
}
