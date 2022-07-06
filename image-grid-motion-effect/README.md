- https://tympanus.net/codrops/?p=50073
- https://blog.tubikstudio.com/web-design-basic-types-of-images-web-content/
- https://blog.tubikstudio.com/case-study-tubik-in-paris-design-of-narrative-illustration/
- https://dribbble.com/shots/11630366-Furniture-Ecommerce-Website

- https://parceljs.org/

- https://www.davidwilliambaum.com/

parcel nest route

- https://github.com/parcel-bundler/parcel/issues/4142#issuecomment-832964058

ルーティング複数だと parcel の serve サブコマンドは壊れてる dev で本番サーブなら OK
本番サーブはライブラリで画像の圧縮などする

## Install Library

```
yarn install
```

## Serve Dev

```
yarn dev
```

## Serve Prod

事前に本番サーブはライブラリで画像の圧縮などする
圧縮したものを開発でも使えばよい

```
yarn serve
```
