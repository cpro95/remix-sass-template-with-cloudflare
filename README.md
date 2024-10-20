# Welcome to Remix + Cloudflare!

- 📖 [Remix docs](https://remix.run/docs)
- 📖 [Remix Cloudflare docs](https://remix.run/guides/vite#cloudflare)

## Live Demo

[https://remix-sass-template-with-cloudflare.pages.dev/](https://remix-sass-template-with-cloudflare.pages.dev/)

## Create

```sh
npm create cloudflare@latest
```

## Development

Run the dev server:

```sh
npm run dev
```

To run Wrangler:

```sh
npm run build
npm run start
```

## Typegen

Generate types for your Cloudflare bindings in `wrangler.toml`:

```sh
npm run typegen
```

You will need to rerun typegen whenever you make changes to `wrangler.toml`.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then, deploy your app to Cloudflare Pages:

```sh
npm run deploy
```

## inspired by

[https://github.com/dev-xo/remix-saas](https://github.com/dev-xo/remix-saas)

## remix-flat-routes 설명

`_home+` 폴더 이름에 있는 `_`(언더스코어)가 중요한 역할을 하고 있어.

Remix와 `remix-flat-routes`는 폴더 이름에 언더스코어(`_`)가 붙은 경우 특별한 규칙을 적용해.

이 규칙에 따라서 언더스코어가 붙은 폴더는 경로에 포함되지 않고 무시되는 거야.

### 1. 언더스코어(`_`)가 붙은 폴더의 특별 취급

Remix와 `remix-flat-routes`에서 폴더 이름이 언더스코어(`_`)로 시작하면, 그 폴더는 경로에서 무시돼.

즉, 해당 폴더는 라우트 경로에 포함되지 않고, 대신 그 폴더 안에 있는 파일들이 상위 경로에 직접 매핑돼.

- `_home+/_index.tsx`: 여기서 `_home+` 폴더는 언더스코어(`_`)로 시작하므로, 이 폴더는 경로에 나타나지 않고 무시돼. 따라서 `_home+` 폴더 안에 있는 `_index.tsx` 파일이 루트 경로 `/`에 바로 매핑되는 거야.

- `dashboard+/_index.tsx`: 반면, `dashboard+` 폴더는 언더스코어(`_`)로 시작하지 않기 때문에 경로에 포함돼. 그래서 이 경우, `/dashboard` 경로로 매핑되는 거지.

### 2. 왜 언더스코어(`_`)가 붙은 폴더는 특별 취급되나?

Remix에서 언더스코어(`_`)로 시작하는 폴더나 파일은 라우트 경로에서 제외되는 규칙을 따르는데, 이 규칙은 종종 레거시 경로나 글로벌 레이아웃, 컴포넌트 등을 분리할 때 유용하게 사용돼.

예를 들어:

- `_layout.tsx`: `_layout.tsx` 파일은 해당 폴더의 레이아웃을 정의하지만, 자체적으로 경로를 만들지 않아. 언더스코어가 붙어 있기 때문에 경로에서 무시되고, 그 대신 해당 경로에 대한 공통 레이아웃으로 사용돼.

- `_index.tsx`: `_index.tsx` 파일은 언더스코어가 붙어도 기본적으로 해당 폴더의 인덱스 경로로 작동하지만, 언더스코어로 시작하는 폴더 안에 있으면 그 폴더가 경로에서 무시되므로, 상위 경로에 직접 매핑돼.

### 3. 정리

- 언더스코어(`_`)가 붙은 폴더는 경로에서 무시된다.
- `_home+/_index.tsx`는 `_home+` 폴더가 언더스코어(`_`)로 시작하기 때문에 경로에 나타나지 않고, 루트 경로 `/`에 바로 매핑된다.
- `dashboard+/_index.tsx`는 언더스코어(`_`)가 없기 때문에 `/dashboard` 경로에 매핑된다.

### 결론
`_home+` 폴더에 언더스코어가 붙어 있기 때문에, 이 폴더는 경로에서 무시되면서 그 안의 파일들이 루트 경로에 매핑되는 거야.

반면, 언더스코어가 없는 `dashboard+` 폴더는 경로에 포함되기 때문에 `/dashboard`로 매핑되는 차이가 발생하는 거지.

## 문제상황
새로운 포트폴리오 사이트를 만들고 있는 중이었다. 자료는 프로젝트들의 내용이 같을 거기 때문에 사진 및 텍스트 정보를 한번에 끌고 와서 assets폴더에 넣고 나머지 디자인 및 작업을 하고 푸쉬를 했더니 제목과 같은 에러가 났다.

## 문제이유
찾아본 결과 깃헙에 자료를 올리는데 한번에 너무 많은 데이터의 양을 시도하면 위와 같은 에러가 난다는 것을 알아냈다. 해결책으로 아래와 같은 명령을 주고 다시 push를 하면 됐다.

```sh
❯ git config --global http.postBuffer 524288000             
```

## 문제해결
위와 같이 한다음에 git push -u origin main를 실행하였고 결과 성공적으로 에러없이 해결할 수 있었다.
