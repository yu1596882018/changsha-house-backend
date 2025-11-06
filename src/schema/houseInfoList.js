module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'house_info_list',
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
        comment: '所属区域 ',
      },
      b: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '开发商',
      },
      c: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '项目地址',
      },
      d: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '售楼处地址',
      },
      e: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '规划户数',
      },
      f: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '总占地面积',
      },
      g: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '总建筑面积',
      },
      h: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '容积率',
      },
      i: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '绿化率',
      },
      j: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '物业费',
      },
      k: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '立项批文号',
      },
      l: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '总栋数',
      },
      m: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '销售起价',
      },
      n: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '售楼部电话',
      },
      o: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '公交路线',
      },
      p: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '设计单位',
      },
      q: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '销售代理',
      },
      r: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '物业管理',
      },
      s: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '施工单位',
      },
      t: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '竣工时间',
      },
      u: {
        type: DataTypes.STRING(10000),
        allowNull: true,
        comment: '项目简介',
      },
      v: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '小区id',
      },
      w: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '小区名称',
      },
    },
    {
      sequelize,
      tableName: 'house_info_list',
      timestamps: true,
      updatedAt: 'updated_at',
      createdAt: 'created_at',
    }
  )
}
