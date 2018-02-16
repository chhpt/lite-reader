/*
 * Created by wuyiqing at 2017/9/27 下午9:01
 * 对私密信息进行加密
 */
import HmacMD5 from 'crypto-js/hmac-md5';
import MD5 from 'crypto-js/md5';

/**
 * 对密码进行加密
 * @param password
 * @param key
 * @returns {String}
 */
const passwordEncrypt = (password, key = '1234') => {
  // 将密码用 MD5 加密
  const cryptPassword = MD5(password).toString();
  // 使用 HmacMD5 进行再次加密
  return HmacMD5(cryptPassword, key);
};

export default passwordEncrypt;
