+++
title = "systemctlについて"
published = "2025-05-02"
draft = false
tags = ["linux"]
+++

# systemctlコマンド

systemctlコマンドはLinuxで使われるsystemdの管理ツール。実行中のサービスの起動や停止、再起動、ブート時に起動するサービスの有効化と無効化、利用可能なサービスのリスト表示、システムのステータス確認など、多くの管理タスクに使用する。

systemdとは
systemdはLinuxで利用されているデファクトスタンダードな初期化システムで、システムの起動時に各種サービスを立ち上げる役割を担う。

## サービス管理

### サービスの起動と停止

- systemctl start <サービス名>：サービスを起動する
- systemctl stop <サービス名>：サービスを停止する
- systemctl restart <サービス名>：サービスを再起動する
- systemctl reload <サービス名>：サービスの設定を再読込する（サービスを停止させずに）。

### サービスの状態確認

- systemctl status <サービス>：サービスの現在の状態を表示する。

### サービスの有効化と無効化

- systemctl enable <サービス>：システム起動時にサービスを自動的に起動するように設定する。
- systemctl disable <サービス>：システム起動時にサービスを自動的に起動しないように設定する。

### サービスの一覧表示

- systemctl list-units --type=service：現在のサービスの一覧を表示する。

## システム管理

### システムの停止と再起動

- systemctl halt：システムを停止しhalt状態にする。
- systemctl poweroff：システムを停止し電源を切断する。
- systemctl reboot：システムを再起動する。

### システムの状況確認

- systemctl list-units：現在のすべてのユニット（サービス、マウントポイント、スワップ領域など）の一覧を表示する。
- systemctl get-default：システムのデフォルトのターゲット（起動時のシステム状態）を表示する。

## ターゲット管理

- systemctl isolote <ターゲット名>：指定したターゲットに切り替える。
- systemctl set-default <ターゲット名>：システム起動時のデフォルトのターゲットを設定する。

### ターゲットについて

複数のユニット（サービスやマウントポイント、デバイスなど）をグループ化し、システムの特定の状態や実行モードを表現する役割を持つ。
下記表が主なターゲット

| ターゲット        | 説明                         | ランレベル |
| ----------------- | ---------------------------- | ---------- |
| poweroff.target   | システム終了                 | 0          |
| rescue.target     | レスキュー（シングルモード） | 1          |
| multi-user.target | CUIログイン                  | 2,3,4      |
| graphical.target  | グラフィカルログイン         | 5          |
| reboot.target     | システム再起動               | 6          |

## 参考サイト

[【完全版】systemctlのコマンド一覧｜実例付きで徹底解説](https://itc.tokyo/linux/systemctl/)

[Linuxのsystemctlとは - Web開発における知見共有系ページ](https://job-info.hateblo.jp/entry/2024/08/16/230855)

[systemdのターゲット(target) - KoANアカデミー](https://koanacademy.jp/systemd_target)
