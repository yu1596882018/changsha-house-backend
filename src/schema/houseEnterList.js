module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'house_enter_list',
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
        comment: '项目名称',
      },
      b: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '项目坐落',
      },
      c: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '预售证号',
      },
      d: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '发证日期',
      },
      e_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '小区id',
      },
    },
    {
      sequelize,
      tableName: 'house_enter_list',
      timestamps: false,
    }
  )
}
