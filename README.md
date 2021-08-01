# NodeCat_clone

JWT를 사용하여 [NodeBirdAPI_clone](https://github.com/yamkim/NodeBirdAPI_clone/) 서비스에 요청 및 응답을 확인하는 서비스입니다.

## 구동시키기 위해 설정해야할 파일

### 1. `.env` 파일

- PORT=PORT_NUMBER_FOR_LISTENING

- COOKIE_SECRET=COOKIE_SECRET_FOR_COOKIE_PARSER
- CLIENT_SECRET=CLIENT_SECRET_FROM_NODEBIRDAPI_CLONE

## 기능 및 사용법

- [NodeBirdAPI_clone](https://github.com/yamkim/NodeBirdAPI_clone/)로부터 발급받은 CLIENT_SECRET을 `.env`에 기입하여 사용합니다.
- http://localhost:4000/posts/my에 요청을 보낸다면, 로그인된 id(JWT에 포함되어 있는 정보)의 유저가 작성한 게시글을 JSON으로 반환합니다.
- http://localhost:4000/search/HASHTAG에 요청을 보낸다면, HASHTAG에 기입한 hashtag가 포함된 모든 게시글을 JSON으로 반환합니다.

