+++
title = "Ubuntu 24.04でEmacs最新版をソースからインストールする（ネイティブコンパイル対応）"
published = 2025-05-17
draft = false
tags = ["ubuntu"]
+++

# Ubuntu 24.04でEmacs最新版をソースからインストールする（ネイティブコンパイル対応）

こんにちは！
この記事では、**Ubuntu 24.04**に**最新版のEmacs**を**ソースコードからインストール**する手順をまとめます。
特に最近重要になっている**ネイティブコンパイル（Native Compilation）対応**のビルド方法も含みます！

> 対象読者：Ubuntu 24.04を使っていて、apt版より新しいEmacsを使いたい人
> 難易度：中級（ビルド経験が少しでもあれば大丈夫！）

## 1. はじめに（apt版ではダメなの？）

Ubuntu 24.04のaptリポジトリにもEmacsはありますが、

- バージョンが古いことがある
- ネイティブコンパイル対応が不完全な場合がある

ため、**ソースから自分でビルドする**ことで、

- 最新版Emacs
- ネイティブコンパイル対応
- 起動・動作の高速化
  が実現できます！

## 2. 必要な開発ツールをインストールする

まずはビルドに必要なツールとライブラリをまとめてインストールします。

```bash
sudo apt update
sudo apt install -y build-essential libgccjit-13-dev gcc-13 g++-13 \
libjansson-dev libjpeg-dev libpng-dev libtiff-dev libgif-dev libxpm-dev \
libncurses-dev libgtk-3-dev libxaw7-dev libxft-dev libmagickwand-dev \
libtree-sitter-dev librsvg2-dev
```

> ✏️ ポイント：
>
> - `gcc-13` + `libgccjit-13-dev` が揃っていれば、**ネイティブコンパイル**が有効になります！
> - これにより、Emacsが内部的に高速な`.eln`ファイルを生成できるようになります。

## 3. Emacsのソースコードを入手する

**Emacs公式サイト**から最新版ソースコードをダウンロードします。

- [GNU Emacs公式ダウンロードページ](https://ftp.gnu.org/gnu/emacs/)

上記リンクから

- **最新版の `.tar.gz` ファイル**（例：`emacs-30.1.tar.gz`）
  をダウンロードしてください。

ダウンロードしたら、ターミナルで解凍します。

```bash
cd ~/Downloads
tar xvf emacs-30.1.tar.gz
cd emacs-30.1
```

## 4. ビルド専用ディレクトリを作る（おすすめ）

ビルドファイルをソースと分けるため、専用ディレクトリを作ります。

```bash
mkdir build
cd build
```

これによりソースツリーがきれいなままビルドできます！

## 5. configureを実行（ビルド設定）

**gcc-13を指定してネイティブコンパイルを有効化**します。

```bash
CC=gcc-13 CXX=g++-13 ../configure --with-native-compilation
```

✅ 成功すれば最後に `Configuration done.` と表示されます。

## 6. make（コンパイル）

CPUコアをフル活用して高速ビルドします。

```bash
make -j$(nproc)
```

## 7. make install（インストール）

ビルドが完了したら、管理者権限でインストールします。

```bash
sudo make install
```

デフォルトでは `/usr/local/bin/emacs` にインストールされます。

## 8. インストール確認

インストールできたか確認しましょう。

```bash
emacs --version
```

例：

```
GNU Emacs 30.1
```

と出れば成功です！

## 9. インストール後のポイント

- この手順でインストールしたEmacsは、ネイティブコンパイル（.elnファイル）対応版です。
- Emacsの起動後、自動的に`.eln`ファイルが生成されるため、起動・動作が非常に高速になります。
- `/usr/bin/emacs` に古いapt版が残っていても、パス優先順位により `/usr/local/bin/emacs` が使われます。（通常問題なし）

# 📋 まとめ（コマンド一覧）

| ステップ                 | コマンド例                                                            |
| :----------------------- | :-------------------------------------------------------------------- |
| パッケージインストール   | `sudo apt install build-essential libgccjit-13-dev gcc-13 g++-13 ...` |
| ソース解凍               | `tar xvf emacs-30.1.tar.gz && cd emacs-30.1`                          |
| ビルド用ディレクトリ作成 | `mkdir build && cd build`                                             |
| configure                | `CC=gcc-13 CXX=g++-13 ../configure --with-native-compilation`         |
| make                     | `make -j$(nproc)`                                                     |
| make install             | `sudo make install`                                                   |
| バージョン確認           | `emacs --version`                                                     |

> この記事はchatGPTを使用して書きました。筆者も実際にこの手順でインストールできたので大丈夫だと思いますが、もしビルドに失敗したなどがありましたら、コメントを残していただければ幸いです。
