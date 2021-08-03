const express = require('express');
const axios = require('axios');

const router = express.Router();

// const apiURL = 'http://localhost:8002/v1';
const apiURL = 'http://localhost:8002/v2';
axios.defaults.headers.origin = 'http://localhost:4000';

const axiosNodeBirdApi = async (req, api) => {
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
    if (err.response.status === 419) {
      delete req.session.jwt;
      return axiosNodeBirdApi(req, api);
    }       
    return err.response;
  }
}

const returnJsonData = async function (req, res, next) {
  try {
    const result = await axiosNodeBirdApi(req, req.apiUrl);
    res.json(result.data);
  } catch (err) {
    console.error(err);
    next(err);
  }
}

const IndexRouteHandler = {
  returnAllPostsForUser: async function(req, res, next) {
    req.apiUrl = '/posts/my';
    returnJsonData(req, res, next);
  },

  returnAllPostsAboutHashtag: async function(req, res, next) {
    req.apiUrl = `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`;
    returnJsonData(req, res, next);
  }
}

router.get('/', (req, res) => {
  res.render('main', { key: process.env.CLIENT_SECRET });
});
router.get('/mypost', IndexRouteHandler.returnAllPostsForUser);
router.get('/search/:hashtag', IndexRouteHandler.returnAllPostsAboutHashtag);

module.exports = router;