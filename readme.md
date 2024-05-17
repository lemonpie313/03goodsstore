# 상품 등록, 조회, 수정, 삭제 기능 구현

## 프로젝트 소개
express.js, MongoDB를 이용하여, 상품 정보를 등록, 조회, 수정, 삭제가 가능한 프로그램을 개발하였다.
|분류|설명|Method|URL|작성|구현|
|---|---|---|---|---|---|
|상품|상품 생성 (C)|POST|/products|O|O|
|상품|상품 목록 조회 (R)|GET|/products|O|O|
|상품|상품 상세 조회 (R)|GET|/products/:id|O|O|
|상품|상품 수정 (U)|PUT|/products/:id|O|O|
|상품|상품 삭제 (D)|DELETE|/products/:id|O|O|

### 0. 공통
#### 1) Response-Success
|이름|타입|설명|
|---|---|---|
|status|number|HTTP Status Code|
|message|string|API 호출 성공 메시지|
|data|Object|API 호출 결과 데이터|

```
{
  "status": 201,
  "message": "상품 생성에 성공했습니다.",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "페레로로쉐",
    "description": "맛있는 초콜렛",
    "manager": "스파르탄",
    "status": "FOR_SALE",
    "createdAt": "2024-05-01T05:11:06.285Z",
    "updatedAt": "2024-05-01T05:11:06.285Z", 
  }
}
```

#### 2) Response-Failure
|이름|타입|설명|
|---|---|---|
|status|number|HTTP Status Code|
|message|string|API 호출 실패 메시지|

|status|message|설명|
|---|---|---|
|400|상품명을 입력해주세요|상품명이 빈 문자열일 경우 or 빠져있을 경우
|400|상품명은 문자열이어야 합니다|상품명이 다른 형태로 전달되었을 경우
|400|상품명은 10글자 이내로 입력해주세요|상품명의 글자수가 조건에 맞지 않을 경우
|400|상세 정보를 입력해주세요|상세정보가 빈 문자열일 경우 or 빠져있을 경우
|400|상세 정보는 문자열이어야 합니다|상세정보가 다른 형태로 전달되었을 경우
|400|상세 정보는 50글자 이내로 입력해주세요|상세정보의 글자수가 조건에 맞지 않을 경우
|400|관리자명을 입력해주세요|관리자명이 빈 문자열일 경우 or 빠져있을 경우
|400|관리자명은 문자열이어야 합니다|관리자명이 다른 형태로 전달되었을 경우
|400|관리자명은 50글자 이내로 입력해주세요|관리자명의 글자수가 조건에 맞지 않을 경우
|400|비밀번호를 입력해주세요|비밀번호가 빈 문자열일 경우 or 빠져있을 경우
|400|비밀번호는 문자열이어야 합니다|비밀번호가 다른 형태로 전달되었을 경우
|400|비밀번호는 4글자 이상 10글자 이하로 입력해주세요|비밀번호의 글자수가 조건에 맞지 않을 경우
|400|비밀번호는 대소문자, 숫자로만 입력할 수 있습니다|비밀번호에 대소문자, 숫자가 아닌 다른 값이 포함되었을 경우
|400|비밀번호는 대소문자, 숫자로만 입력할 수 있습니다|비밀번호에 대소문자, 숫자가 아닌 다른 값이 포함되었을 경우
|404|존재하지 않는 상품입니다|조회, 수정, 삭제 시 id에 해당하는 데이터가 존재하지 않을 경우
|401|비밀번호가 일치하지 않습니다|수정, 삭제 시 비밀번호가 일치하지 않을 경우
|500|서버에서 에러가 발생하였습니다.|그 외 에러


### 1. POST - 상품 등록
#### 1) Response - Body
|이름|타입|필수 여부|설명|
|---|---|---|---|
|name|string|y|상품명|
|description|string|y|상세 정보|
|manager|string|y|관리자|
|password|string|y|비밀번호|

```
{
  "name": "페레로로쉐",
  "description": "맛있는 초콜렛",
  "manager": "스파르탄",
  "password": "spartan!!123"
}
```

#### 2) Response - Success
|이름|타입|설명|
|---|---|---|
|status|number|HTTP Status Code|
|message|string|API 호출 성공 메시지|
|data|Object|API 호출 결과 데이터|

|status|message|설명|
|---|---|---|
|201|상품 생성에 성공했습니다.|상품이 정상적으로 등록되었을 경우

```
{
  "status": 201,
  "message": "상품 생성에 성공했습니다.",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "페레로로쉐",
    "description": "맛있는 초콜렛",
    "manager": "스파르탄",
    "status": "FOR_SALE",
    "createdAt": "2024-05-01T05:11:06.285Z",
    "updatedAt": "2024-05-01T05:11:06.285Z", 
  }
}
```


### 2. GET - 상품 목록 조회
#### 1) Response-Success
|이름|타입|설명|
|---|---|---|
|id|string|상품 ID|
|name|string|상품명|
|description|string|상세 정보|
|manager|string|관리자|
|status|string|상품 상태|
|createdAt|Date|생성 일시|
|updatedAt|Date|생성 일시|

|status|message|설명|
|---|---|---|
|200|상품 목록 조회에 성공했습니다.|상품 조회가 정상적으로 이루어졌을 경우

```
{
  "status": 200,
  "message": "상품 목록 조회에 성공했습니다.",
  "data": [
	  {
	    "id": "507f1f77bcf86cd799439011",
	    "name": "페레로로쉐",
	    "description": "맛있는 초콜렛",
	    "manager": "스파르탄",
	    "status": "FOR_SALE",
	    "createdAt": "2024-05-01T05:11:06.285Z",
	    "updatedAt": "2024-05-01T05:11:06.285Z"
	  },
	  {
	    "id": "507f1f77bcf86cd799439011",
	    "name": "킨더조이",
	    "description": "장난감 초콜렛",
	    "manager": "스파르탄",
	    "status": "FOR_SALE",
	    "createdAt": "2024-05-01T05:11:06.285Z",
	    "updatedAt": "2024-05-01T05:11:06.285Z"
	  }
  ]
}
```

### 3. GET - 상품 상세 조회
#### 1) Request - Path.parameters

|이름|타입|설명|
|---|---|---|
|id|string|상품 ID|

```
/products/507f1f77bcf86cd799439011
```
#### 2) Response - Success
|이름|타입|설명|
|---|---|---|
|id|string|상품 ID|
|name|string|상품명|
|description|string|상세 정보|
|manager|string|관리자|
|status|string|상품 상태|
|createdAt|Date|생성 일시|
|updatedAt|Date|생성 일시|

```
{
  "status": 200,
  "message": "상품 상세 조회에 성공했습니다.",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "페레로로쉐",
    "description": "맛있는 초콜렛",
    "manager": "스파르탄",
    "status": "FOR_SALE",
    "createdAt": "2024-05-01T05:11:06.285Z",
    "updatedAt": "2024-05-01T05:11:06.285Z"
  }
}
```

### 4. PUT - 상품 수정
#### 1) Request - Path.parameters

|이름|타입|설명|
|---|---|---|
|id|string|상품 ID|

```
/products/507f1f77bcf86cd799439011
```
#### 2) Request - Body
|이름|타입|필수 여부|설명|
|---|---|---|---|
|name|string|n|상품명|
|description|string|n|상세 정보|
|manager|string|n|관리자|
|status|string|n|상품 상태|
|password|string|y|비밀번호|

```
{
  "name": "페레로로쉐",
  "description": "맛있는 초콜렛",
  "manager": "스파르탄",
  "status": "SOLD_OUT",
  "password": "spartan!!123"
}
```

#### 3) Response - Success
|이름|타입|설명|
|---|---|---|
|id|string|상품 ID|
|name|string|상품명|
|description|string|상세 정보|
|manager|string|관리자|
|status|string|상품 상태|
|createdAt|Date|생성 일시|
|updatedAt|Date|생성 일시|

예시
```
{
  "status": 200,
  "message": "상품 수정에 성공했습니다.",
  "data": {
    "id": 1,
    "name": "페레로로쉐",
    "description": "맛있는 초콜렛",
    "manager": "스파르탄",
    "status": "SOLD_OUT",
    "createdAt": "2024-05-01T05:11:06.285Z",
    "updatedAt": "2024-05-01T05:11:06.285Z"
  }
}
```


### 5. DELETE - 상품 삭제
#### 1) Request - Path.parameters

|이름|타입|설명|
|---|---|---|
|id|string|상품 ID|

```
/products/507f1f77bcf86cd799439011
```
#### 2) Response - Success
|이름|타입|설명|
|---|---|---|
|id|string|상품 ID|
|name|string|상품명|
|description|string|상세 정보|
|manager|string|관리자|
|status|string|상품 상태|
|createdAt|Date|생성 일시|
|updatedAt|Date|생성 일시|

예시
```
{
  "status": 200,
  "message": "상품 삭제에 성공했습니다.",
  "data": {
    "id": 1,
    "name": "페레로로쉐",
    "description": "맛있는 초콜렛",
    "manager": "스파르탄",
    "status": "SOLD_OUT",
    "createdAt": "2024-05-01T05:11:06.285Z",
    "updatedAt": "2024-05-01T05:11:06.285Z"
  }
}
```



## 코드 설명
### 1. ./src/crypto
- crypto-passwords.js : crypto 모듈을 이용하여 비밀번호를 암호화한다.
### 2. ./src/middlewares
- error-handler.middleware.js : 상품 입력, 조회, 수정, 삭제 시 발생하는 에러에 대한 에러 핸들러이다.
### 3. ./src/router
- joi-products.js : 상품 등록, 수정, 삭제 시 입력받는 값의 유효성 검증을 위한 joi를 설정하였다.
- router-products.js : /products 경로의 CRUD 라우터를 구현하였다.
### 4. ./src/schemas
- index.js : MongoDB와의 연결을 위한 파일이다.
- schemas-products.js : 데이터 생성 시 사용되는 스키마를 정의하였다.

## 요구사항

### 1. 셋팅
- [x] `README.md` 파일을 생성하여 간략한 프로젝트의 설명 및 실행 방법을 작성합니다.
- [x] `.env` 파일을 이용해서 민감한 정보(DB 계정 정보 등)를 관리합니다.
- [x] `.gitignore` 파일을 생성하여 `.env` ,`node_modules` 등
불필요하거나 민감한 정보가 Github에 올라가지 않도록 설정합니다.
- [x] `.prettierrc` 파일을 생성하여 일정한 코드 형태를 유지할 수 있도록 설정합니다.
- [x] `package.json` 파일의 `scripts` 항목에 `dev` 라는 이름을 추가하여 nodemon을 이용해서 서버를 실행할 수 있도록 합니다.

### 2. 필수 API 구현

#### 1) 상품 생성 API
- [x] 상품명, 상품 설명, 담당자, 비밀번호를 **Request body(`req.body`)** 로 전달 받습니다.
- [x] 상품 ID는 전달 받지 않고, 자동으로 생성합니다. (MongoDB Document 추가 시 기본 생성되는 `_id`를 사용해도 됩니다.)
- [x] 상품은 두 가지 상태, **판매 중(`FOR_SALE`)및 판매 완료(`SOLD_OUT`)** 를 가질 수 있습니다.
- [x] 상품 등록 시 기본 상태는 **판매 중(`FOR_SALE`)** 입니다.
- [x] **생성 일시, 수정 일시**를 자동으로 생성합니다.

#### 2) 상품 목록 조회 API
- [x] **상품 ID, 상품명, 상품 설명, 담당자, 상품 상태, 생성 일시, 수정 일시** 를 조회합니다.
- [x] **비밀번호**를 포함하면 안됩니다.
- [x] 상품 목록은 **생성 일시**를 기준으로 **내림차순(최신순)** 정렬합니다.

#### 3) 상품 상세 조회 API
- [x] **상품 ID**를 **Path Parameter**(`req.params`)로 전달 받습니다.
- [x] **상품 ID, 상품명, 상품 설명, 담당자, 상품 상태, 생성 일시, 수정 일시** 를 조회합니다.
- [x] **비밀번호**를 포함하면 안됩니다.

#### 4) 상품 수정 API
- [x] **상품 ID**를 **Path Parameter**(`req.params`)로 전달 받습니다.
- [x] **상품명, 상품 설명, 담당자, 상품 상태, 비밀번호**를 **Request body**(`req.body`)로 전달 받습니다.
- [x] **수정할 상품과 비밀번호 일치 여부를 확인**한 후, 동일할 때만 상품이 **수정**되어야 합니다. 일치하지 않을 경우, **“비밀번호가 일치하지 않습니다.”** 메세지를 반환합니다.

#### 5) 상품 삭제 API
- [x] **상품 ID**를 **Path Parameter**(`req.params`)로 전달 받습니다.
- [x] **비밀번호**를 **Request body**(`req.body`)로 전달 받습니다.
- [x] **삭제할 상품과 비밀번호 일치 여부를 확인**한 후, 동일할 때만 글이 **삭제**되어야 합니다. 일치하지 않을 경우, **“비밀번호가 일치하지 않습니다.”** 메세지를 반환합니다.

### 3. 유효성 검사 및 에러 처리
#### 1) 에러 처리 (에러 처리 미들웨어)

- [x] **상품 상세 조회, 수정, 삭제 시** **상품이 없는 경우**에는 “**상품이 존재하지 않습니다.**” 메세지를 반환합니다. **상품 목록 조회 시** **상품이 없는 경우**에는 **빈 배열(`[]`)을 반환**합니다.
- [x] **상품 생성 시** 입력 받은 상품명이 **기존에 등록 된 상품명과 동일한 경우**에는 **“이미 등록 된 상품입니다.”** 메세지를 반환합니다.
- [x] **그 밖의 에러가 발생했을 때**에는 **“예상치 못한 에러가 발생했습니다. 관리자에게 문의해 주세요.”** 메세지를 반환합니다.

#### 2) 유효성 검증 (Joi)

- [x] **상품 생성 시 정보가 빠진 경우**, **“OOO을(를) 입력해 주세요.”** 메시지를 반환합니다.
예) ****“상품명을 입력해 주세요”, “담당자를 입력해 주세요.” 등…
- [x] **상품 수정, 삭제 시 비밀번호가 없는 경우**, **“비밀번호를 입력해 주세요.”** 메세지를 반환합니다.
- [x] **상품 수정 시** 상품 상태에 `FOR_SALE`, `SOLD_OUT` 이 외의 다른 값이 입력된 경우, **“상품 상태는 [FOR_SALE,SOLD_OUT] 중 하나여야 합니다.”** 메세지를 반환합니다.

