#!/bin/sh
cd ../
mkdir -p output  # 이미 존재하면 오류 방지
cp -R ./pillyohae_FE/* ./output  # 올바른 프로젝트 루트 폴더 사용
cp -R ./output ./pillyohae_FE/