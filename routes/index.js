const express = require('express');
const axios = require('axios');

const router = express.Router();

const apiURL = 'http://localhost:8002/v1';
axios.defaults.headers.origin = 'http://localhost:4000';

const request = async (req, api) => {
  try {
    if (!req.session.jwt) {
      const tokenResult = await axios.post(`${apiURL}/token`, {
        clientSecret: process.env.CLIENT_SECRET,
      });
      req.session.jwt = tokenResult.data.token;
    }

    return await axios.get(`${apiURL}${api}`, {
      headers: { authorization: req.session.jwt },
    });
  } catch (err) {
    if (error.response.status === 419) {
      delete req.session.jwt;
      return request(req, api);
    }
    return err.response;
  }
}

router.get('/mypost', async (req, res, next) => {
  try {
    const result = await request(req, '/posts/my');
    res.json(result.data);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get('/search/:hashtag', async (req, res, next) => {
  try {
    const result = await request(
      req, `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`,
    );
    res.json(result.data);
  } catch (err) {
    if (err.code) {
      console.error(err);
      next(err);
    }
  }
});

// router.get('/test', async (req, res, next) => {
//   try {
//     if (!req.session.jwt) { // 세션에 토큰이 없으면 발급을 시도합니다.
//       const tokenResult = await axios.post('http://localhost:8002/v1/token', {
//         clientSecret: process.env.CLIENT_SECRET,
//       });
//       if (tokenResult.data && tokenResult.data.code === 200) { // 토큰 발급이 성공하는 경우입니다.
//         req.session.jwt = tokenResult.data.token;
//       } else {                                                 // 토큰 발급 실패시, data에 실패 사유가 기입됩니다.
//         return res.json(tokenResult.data);
//       }
//     }
//     // 발급받은 토큰 테스트
//     const result = await axios.get('http://localhost:8002/v1/test', {
//       headers: { authorization: req.session.jwt },
//     });
//     return res.json(result.data);
//   } catch (error) {
//     console.error(error);
//     if (error.response.status === 419) {
//       return res.json(error.response.data);
//     }
//     return next(error);
//   }
// });

module.exports = router;