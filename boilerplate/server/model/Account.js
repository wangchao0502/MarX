const Account = (sequelize, DataTypes) =>
  sequelize.define('Account', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: '',
      comment: '系统账号 登陆用的',
    },
    password: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: '',
      comment: '登陆密码',
    },
  });

export default Account;
