# Ethereum 테스트하기
## Hardhat
1. __Prerequisites__
    - 공유폴더에서 symbolic link 사용하도록 수정
        - <code># 관리자 권한으로 cmd창 열기</code>
        - <code>## VirtualBox 설치 디렉토리 이동</code>
            1. <code>cd "C:\Program Files\Oracle\VirtualBox"</code>
        - <code>## 설정 방법</code>
            1. <code>VBoxManage setextradata [vm명] VBoxInternal2/SharedFoldersEnableSymlinksCreate/[Sharename] 1</code>
            1. <code>ex) VBoxManage setextradata Ubuntu_ethereum VBoxInternal2/SharedFoldersEnableSymlinksCreate/ws 1</code>
        - <code>## 설정 확인방법</code>
            1. <code>VBoxManage getextradata [vm명] VBoxInternal2/SharedFoldersEnableSymlinksCreate/[Sharename]</code>
            1. <code>ex) VBoxManage getextradata Ubuntu_ethereum VBoxInternal2/SharedFoldersEnableSymlinksCreate/ws</code>
        &nbsp;
        - <code>## Windows 기능 켜기/끄기</code>
            1. <code>[Linux용 Windows 하위 시스템] 기능 켜기</code>
        - <code>## 사용자 symbolic link 권한 추가</code>
            1. <code>win + r >> secpol.msc</code>
            1. <code>[메뉴] 로컬 정책 >> 사용자 권한 할당</code>
            1. <code>[정책] 심볼 링크 만들기 >> 사용자 또는 그룹 추가 >> 이름(조직 사용자명, 혹은 메일계정/사번) 입력 후 이름 체크 후 확인</code>
    &nbsp;
    - package (xdisplay)
        - // vm 내부의 VScode를 사용하고자 하면 진행
        - <code>sudo apt update -y</code>
        - <code>sudo apt install -y ca-certificates fonts-liberation libappindicator3-1 libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils</code>
    - VScode
        > https://code.visualstudio.com/docs/supporting/faq#_previous-release-versions
        - // vm 내부의 VScode를 사용하고자 하면 진행
        - <code>## must non root user</code>
            1. <code>mkdir -p /usr/local/bin && cd \$_</code>
            1. <code>CODE_VERSION=1.84.2</code>
            1. <code>wget --no-check-certificate https://update.code.visualstudio.com/${CODE_VERSION}/linux-x64/stable -O code_\${CODE_VERSION}.tar.gz</code>
            1. <code>mkdir -p code_\${CODE_VERSION} && tar zxf code_\${CODE_VERSION}.tar.gz -C code_\${CODE_VERSION} --strip-components 1</code>
            1. <code>ln -sf code_\${CODE_VERSION}/bin/* /usr/local/bin/</code>
            1. <code>code \${HARDHAT_HOME}/../</code>
    - Environments
        - <code>## root 계정으로 실행</code>
            1. <code>HARDHAT_HOME=/mnt/ws/pgws/documents/project/2312_LGE-Artlab/src/hardhat && PROFILE_FILE=/etc/profile</code>
            1. <code>echo -e "\n##setting work directory" >> \${PROFILE_FILE}</code>
            1. <code>echo  "export HARDHAT_HOME=\${HARDHAT_HOME}" >> \${PROFILE_FILE}</code>
            1. <code>echo  'alias cdws=\"cd \${HARDHAT_HOME}\"' >> \${PROFILE_FILE}</code>
        &nbsp;
        - <code>## 사용할 계정으로 실행</code>
            1. <code>source \${PROFILE_FILE}</code>
    - node && npm(npx)
        > https://nodejs.org/en/about/previous-releases
        - <code>## 24.01.09 기준 v20.10.0 (20버전 23.10 ~ 26.05 maintenance 예정)</code>
            1. <code>mkdir -p /usr/local/tools && cd \$_</code>
            1. <code>NODE_VERSION=v20.10.0</code>
            1. <code>wget --no-check-certificate https://nodejs.org/download/release/${NODE_VERSION}/node-${NODE_VERSION}-linux-x64.tar.gz</code>
            1. <code>tar zxf node-\${NODE_VERSION}-linux-x64.tar.gz</code>
            1. <code>ln -sf ${PWD}/node-\${NODE_VERSION}-linux-x64/bin/* /usr/local/bin/</code>
        &nbsp;
        - <code>## check installed node</code>
            1. <code>node -v && npm -v && npx -v</code>
                > __##Reponse##__
                \
                v20.10.0
                \
                10.2.3
                \
                10.2.3

1. __Setting Harhat workspace__
    - 참고 : https://hardhat.org/hardhat-runner/docs/getting-started
        - <code>mkdir -p \${HARDHAT_HOME} && cd $_</code>
        - <code>npm install --save-dev hardhat</code>
        - <code>npx hardhat init</code>
            > <code>## project 설정에 대한 부분은 적당히 체크해서 넘김</code>
            \
            > <code>What do you want to do? · Create a TypeScript project</code>
            \
            > <code>Hardhat project root: · /usr/local/src/hardhat</code>
            \
            > <code>Do you want to add a .gitignore? (Y/n) · y</code>
            \
            > <code>Do you want to install this sample project's dependencies with npm (@nomicfoundation/hardhat-toolbox)? (Y/n) · y</code>
    - __Complie contract__
        - <code>cd \${HARDHAT_HOME}</code>
        - <code>npx hardhat compile</code>
            > __##Reponse##__
            \
            Compiled 1 Solidity file successfully (evm target: paris).
            \
            \
            > <code>## Caused by: Error: self-signed certificate in certificate chain 오류 시 아래처럼 NODE_TLS_REJECT_UNAUTHORIZED 환경변수 세팅</code>
            \
            > <code>NODE_TLS_REJECT_UNAUTHORIZED='0' npx hardhat compile</code>

    - __Test contract__
        - <code>cd \${HARDHAT_HOME}</code>
        - <code>npx hardhat test</code>
            > __##Reponse##__
            \
            Lock
            \
            &nbsp;&nbsp;Deployment
            \
            &nbsp;&nbsp;&nbsp;&nbsp;✔ Should set the right unlockTime (864ms)
            \
            &nbsp;&nbsp;&nbsp;&nbsp;✔ Should set the right owner
            \
            &nbsp;&nbsp;&nbsp;&nbsp;✔ Should receive and store the funds to lock
            \
            &nbsp;&nbsp;&nbsp;&nbsp;✔ Should fail if the unlockTime is not in the future
            \
            &nbsp;&nbsp;Withdrawals
            \
            &nbsp;&nbsp;&nbsp;&nbsp;Validations
            \
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✔ Should revert with the right error if called too soon
            \
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✔ Should revert with the right error if called from another account
            \
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✔ Shouldn't fail if the unlockTime has arrived and the owner calls it
            \
            &nbsp;&nbsp;&nbsp;&nbsp;Events
            \
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✔ Should emit an event on withdrawals
            \
            &nbsp;&nbsp;&nbsp;&nbsp;Transfers
            \
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✔ Should transfer the funds to the owner
            \
            \
        9 passing (982ms)

    - __Deploy contract__
        - <code>cd \${HARDHAT_HOME}</code>
        - <code>npx hardhat run scripts/deploy.js</code>
            > __##Reponse##__
            \
            Lock with 0.001ETH and unlock timestamp 1704760247 deployed to 0x5FbDB2315678afecb367f032d93F642f64180aa3

    - __Starting local network && Deploy contract__
        - <code>cd \${HARDHAT_HOME}</code>
        - <code>npx hardhat node</code>
        - <code>npx hardhat run scripts/deploy.ts --network localhost</code>
        - <code>npx hardhat test --network localhost</code>
