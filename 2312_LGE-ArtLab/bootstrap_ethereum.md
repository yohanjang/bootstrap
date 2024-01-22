# Ethereum 테스트하기
## Hardhat
1. __Setting Harhat workspace__
    - __Prerequisites__
        1. Environments
            1. <code>## root 계정으로 실행</code>
            - <code>HARDHAT_HOME=/monachain/hardhat && PROFILE_FILE=/etc/profile</code>
            - <code>echo -e "\n##setting work directory" >> \${PROFILE_FILE}</code>
            - <code>echo  "export HARDHAT_HOME=\${HARDHAT_HOME}" >> \${PROFILE_FILE}</code>
            - <code>echo  'alias cdhard=\"cd \${HARDHAT_HOME}\"' >> \${PROFILE_FILE}</code>
            <br/>&nbsp;&nbsp;
            1. <code>## 사용할 계정으로 실행</code>
            - <code>source \${PROFILE_FILE}</code>
            <br/>&nbsp;&nbsp;
        1. node && npm(npx)
            > https://nodejs.org/en/about/previous-releases
            1. <code>## 24.01.09 기준 v20.10.0 (20버전 23.10 ~ 26.05 maintenance 예정)</code>
            - <code>mkdir -p /usr/local/tools && cd \$_</code>
            - <code>NODE_VERSION=v20.10.0</code>
            - <code>wget --no-check-certificate https://nodejs.org/download/release/${NODE_VERSION}/node-${NODE_VERSION}-linux-x64.tar.gz</code>
            - <code>tar zxf node-\${NODE_VERSION}-linux-x64.tar.gz</code>
            - <code>ln -sf ${PWD}/node-\${NODE_VERSION}-linux-x64/bin/* /usr/local/bin/</code>
            <br/>&nbsp;&nbsp;
            - <code>## check installed node</code>
                1. <code>node -v && npm -v && npx -v</code>
                    > __##Reponse##__
                    <br/>&nbsp;&nbsp;
                    v20.10.0
                    <br/>&nbsp;&nbsp;
                    10.2.3
                    <br/>&nbsp;&nbsp;
                    10.2.3
    > 참고 : https://hardhat.org/hardhat-runner/docs/getting-started
    - <code>mkdir -p \${HARDHAT_HOME} && cd $_</code>
    - <code>npm install --save-dev hardhat</code>
    - <code>npx hardhat init</code>
        > <code>## project 설정에 대한 부분은 적당히 체크해서 넘김</code>
        <br/>&nbsp;&nbsp;
        > <code>What do you want to do? · Create a TypeScript project</code>
        <br/>&nbsp;&nbsp;
        > <code>Hardhat project root: · /usr/local/src/hardhat</code>
        <br/>&nbsp;&nbsp;
        > <code>Do you want to add a .gitignore? (Y/n) · y</code>
        <br/>&nbsp;&nbsp;
        > <code>Do you want to install this sample project's dependencies with npm (@nomicfoundation/hardhat-toolbox)? (Y/n) · y</code>
    - __Complie contract__
        - <code>cd \${HARDHAT_HOME}</code>
        - <code>npx hardhat compile</code>
            > __##Reponse##__
            <br/>&nbsp;&nbsp;
            <code>Compiled 1 Solidity file successfully (evm target: paris).</code>
            <br/>&nbsp;&nbsp;
            > <code>## Caused by: Error: self-signed certificate in certificate chain 오류 시 아래처럼 NODE_TLS_REJECT_UNAUTHORIZED 환경변수 세팅</code>
            <br/>&nbsp;&nbsp;
            > <code>NODE_TLS_REJECT_UNAUTHORIZED='0' npx hardhat compile</code>
    - __Test contract__
        - <code>cd \${HARDHAT_HOME}</code>
        - <code>npx hardhat test</code>
            > __##Reponse##__
            <br/>&nbsp;&nbsp;
            Lock
            <br/>&nbsp;&nbsp;
            &nbsp;&nbsp;Deployment
            <br/>&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;✔ Should set the right unlockTime (864ms)
            <br/>&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;✔ Should set the right owner
            <br/>&nbsp;&nbsp;
            <br/>&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;✔ Should receive and store the funds to lock
            <br/>&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;✔ Should fail if the unlockTime is not in the future
            <br/>&nbsp;&nbsp;
            &nbsp;&nbsp;Withdrawals
            <br/>&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;Validations
            <br/>&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✔ Should revert with the right error if called too soon
            <br/>&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✔ Should revert with the right error if called from another account
            <br/>&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✔ Shouldn't fail if the unlockTime has arrived and the owner calls it
            <br/>&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;Events
            <br/>&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✔ Should emit an event on withdrawals
            <br/>&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;Transfers
            <br/>&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✔ Should transfer the funds to the owner
            <br/>&nbsp;&nbsp;
        9 passing (982ms)
    - __Deploy contract__
        - <code>cd \${HARDHAT_HOME}</code>
        - <code>npx hardhat run scripts/deploy.ts</code>
            > __##Reponse##__
            <br/>&nbsp;&nbsp;
            Lock with 0.001ETH and unlock timestamp 1704760247 deployed to 0x5FbDB2315678afecb367f032d93F642f64180aa3
        <br/>&nbsp;&nbsp;
    - __Starting local network && Deploy contract__
        - <code>cd \${HARDHAT_HOME}</code>
        - <code>npx hardhat node --hostname 0.0.0.0</code>
        - <code>npx hardhat run scripts/deploy.ts --network localhost</code>
        - <code>npx hardhat test --network localhost</code>
        <br/>&nbsp;&nbsp;
1.  __Setting Blockscout container__
    - __Prerequisites__
        1. docker & docker-compose
            1. <code>## repository 추가</code>
            - <code>sudo apt update</code>
            - <code>sudo apt install apt-transport-https ca-certificates curl gnupg-agent software-properties-common</code>
            - <code>curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -</code>
            - <code>sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu \$(lsb_release -cs) stable"</code>
            - <code>sudo apt-get update</code>
            1. <code>## 이전버전 삭제</code>
            - <code>for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove $pkg; done</code>
            1. <code>## docker 설치</code>
            - <code>sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin</code>
            <br/>&nbsp;&nbsp;
            - <code>## specific version</code>
            - <code>apt-cache madison docker-ce | awk '{ print \$3 }'</code>
            - <code>VERSION_STRING=5:19.03.15\~3-0\~ubuntu-focal</code>
            - <code>VERSION_STRING=5:20.10.24\~3-0\~ubuntu-focal</code>
            - <code>VERSION_STRING=5:23.0.6-1\~ubuntu.20.04\~focal</code>
            - <code>VERSION_STRING=5:24.0.6-1\~ubuntu.20.04\~focal</code>
            - <code>sudo apt-get install -y docker-ce=\${VERSION_STRING} docker-ce-cli=\${VERSION_STRING} containerd.io docker-buildx-plugin docker-compose-plugin</code>
            <br/>&nbsp;&nbsp;
            - <code>## docker 설치 확인</code>
            - <code>docker version</code>
            <br/>&nbsp;&nbsp;
        1. docker & docker-compose
            1. <code>## 2.x 버전</code>
            - <code>COMPOSE_VERSION_V2=v2.24.0</code>
            - <code>sudo curl -L "https://github.com/docker/compose/releases/download/${COMPOSE_VERSION_V2}/docker-compose-$(uname -s)-\$(uname -m)" -o /usr/local/bin/docker-compose</code>
            - <code>sudo chmod +x /usr/local/bin/docker-compose</code>
            <br/>&nbsp;&nbsp;
            1. <code>## 1.x 버전</code>
            - <code>COMPOSE_VERSION_V1=1.29.2</code>
            - <code>sudo curl -L "https://github.com/docker/compose/releases/download/${COMPOSE_VERSION_V1}/docker-compose-$(uname -s)-\$(uname -m)" -o /usr/local/bin/docker-compose</code>
            - <code>sudo chmod +x /usr/local/bin/docker-compose</code>
            <br/>&nbsp;&nbsp;
            1. <code>## docker-compose 설치 확인</code>
            - <code>docker-compose version</code>
            <br/>&nbsp;&nbsp;
        <br/>&nbsp;&nbsp;
    - __start blockscout__
        1. scout docker-compose file
            1. <code>## hardhat node 기동</code>
            - <code>cdhard</code>
            - <code>npx hardhat node --hostname 0.0.0.0</code>
            <br/>&nbsp;&nbsp;
            1. <code>## block scout 기동</code>
            - <code>cdhard</code>
            - <code>docker-compose -f docker-compose-scout.yaml uo</code>
            <br/>&nbsp;&nbsp;
            1. <code>## block scout 기동 확인</code>
                > <code>## 포트포워딩 설정</code>
                <br/>&nbsp;&nbsp;
                <code>호스트 | 게스트</code>
                <br/>&nbsp;&nbsp;
                <code>4000 &nbsp;&nbsp;| 4000</code>
            - <code>호스트PC에서 http://localhost:4000/ 으로 접속</code>
            <br/>&nbsp;&nbsp;
