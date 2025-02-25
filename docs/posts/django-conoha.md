---
title: DjangoをConohaでデプロイ
date: 2020-03-23
---

# DjangoをConohaでデプロイ

DjangoGirlsで作ったWebアプリを、ConoHa VPSでデプロイを見ながらやって詰まったところを補足します。

## 手順

### 2. ConohaのSSH関連を設定　は飛ばせる

デプロイの練習したいだけのただの学生なら飛ばしていいです多分

### python→python3.6にする

3.3. DataBaseを作る　の前にpython3.6と打つ代わりにpythonと打つだけでできるようにするとあとあと楽な気がします。

$ ls -l /bin/python
lrwxrwxrwx. 1 root root 7  9月 19  2019 /bin/python -> python2

$ ln -snf /bin/python3.6 /bin/python
$ ls -l /bin/python
lrwxrwxrwx 1 root root 14  3月 23 20:38 /bin/python -> /bin/python3.6

$ python --version
Python 3.6.8

参考:

https://gametech.vatchlog.com/2019/04/19/puthon36-install/

### sqlite3のアップデート

3.3. DataBaseを作る　で

$ sudo python3.6 manage.py migrate

をした時以下のエラーが出ました。

（略）SQLite 3.8.3 or later is required (found 3.7.17).

Django2.2で開発サーバー起動時にSQLite3のエラーが出た場合の対応を見ながら対応しましたが、このうち、#共有ライブラリへパスを通す　の部分は違う操作をしないと正しいパスでsqlite3を読み込んでくれませんでした。

以下操作を加えました。

$ vim /etc/ld.so.conf

以下を記述
/usr/local/lib 

ldconfig の実行により、/etc/ld.so.cache を更新。これを知らずにだいぶハマった
$ ldconfig

参考：

https://www.infraeye.com/study/linuxz6.html

## CSSが反映されない！

デプロイ環境でCSSを反映させるには2つ必要操作があるようです。

collectstaticApacheのstatic設定

### collectstatic

$ python manage.py collectstatic

上の操作で、cssやらを集めたstaticというフォルダが、setting.pyの中でSTATIC_ROOTに設定した場所にできます。

### Apacheのstatic設定

/etc/httpd/conf/httpd.conf の中に、IncludeOptional conf.d/*.conf という記述があり、conf.d以下のファイルたちが読み込まれるようになっている。

/etc/httpd/conf.d/django.conf に変更を加える。

変更前

```apache
Alias /static/ /home/django/sample/static/
<Directory /home/django/sample/static/>
    Require all granted
</Directory>
```

変更後

```apache
Alias /static/ /home/django/djangogirls/static/
<Directory /home/django/djangogirls/static/>
    Require all granted
</Directory>
```

書き換えおわったら、サービスを再起動してください。

$ sudo service httpd restart

## Debug=Trueについて

mysite/setting.py の中のDebug=True は公開前にFalseにすべきらしい

https://codor.co.jp/django/difference-debug-true-or-false

## 完了なり

これでいけるはずです。