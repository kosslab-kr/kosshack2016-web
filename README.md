# 공개SW 해커톤 2016 웹사이트

> Powered by

![blititor_logo_nodejsstyle7](https://cloud.githubusercontent.com/assets/22411481/18962436/cd87572a-86ab-11e6-8e6b-d145b325e119.png)

## 설치하기

```shell
git clone git://github.com/kosslab-kr/kosshack2016-web.git  # 클론
npm install  # 의존성 설치
node core/setup db  # 데이터베이스 설정
node core/setup db-init  # 필요한 데이터베이스 생성
node core/setup db-init guestbook
node core/setup db-init gallery
node core/setup theme  # 이 단계에서 kosshack 사이트를 고르세요
node core/setup admin  # for admin account
node core/index  # 서버 실행! 기본 포트는 3010입니다
```

and u can connect admin or manager page with `/admin/login` or `/manage/login` in your browser.
