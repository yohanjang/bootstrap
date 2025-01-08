# Solana 노드 구성

## 회사 네트워크 이용 시 인증서 오류가 있다면

```shell
# directory 생성
sudo mkdir -p /usr/share/ca-certificates/extra

# 인증서 복사
# hello.lgcns.com 에서 다운 후 서버에 업로드
sudo cp ~/LGCNS_CA_v3.crt /usr/share/ca-certificates/extra
sudo chmod 644 /usr/share/ca-certificates/extra/*

# 인증서 등록
sudo dpkg-reconfigure ca-certificates
```

## S/W 설치

1. solana CLI
    > OS Command => docker container 테스트 용도

    ```shell
    ## rust
    # install
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

    # environment
    . "$HOME/.cargo/env"

    # check
    rustc --version
    
    ## solana CLI
    # install
    sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"
    # specific version
    SOLANA_RELEASE=1.18.26 sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"

    # environment
    export PATH="${HOME}/.local/share/solana/install/active_release/bin/:${PATH}"

    # check
    solana -V
    solana-genesis -V
    solana-keygen -V

    ## solana config setting
        # CLI node url set (to localhost)
        solana config set -ul
    ```

1. docker
    > Solana 노드 기동 용

    ```shell
    # install
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
    sudo apt-get update

    # uninstall
    for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove $pkg; done

    # show version able install
    apt-cache madison docker-ce | awk '{ print $3 }'
    VERSION_STRING=5:26.1.4-1~ubuntu.22.04~jammy
    sudo apt-get install -y docker-ce=${VERSION_STRING} docker-ce-cli=${VERSION_STRING} containerd.io docker-buildx-plugin docker-compose-plugin

    # docker-compose
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.29.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose

    # check
    docker version
    docker-compose version
    ```

## 노드 설정

1. 노드 사용 key 생성

    ```shell
    # check command
    solana-genesis -V
    solana-keygen -V

    # generate key
    mkdir -p ./key
    ## faucet key
    solana-keygen new --no-passphrase --force -so ./key/faucet-identity.json
    ## validator key
    solana-keygen new --no-passphrase --force -so ./key/validator-identity.json
    ## validator vote key
    solana-keygen new --no-passphrase --force -so ./key/validator-vote-account.json
    ## validator stake key
    solana-keygen new --no-passphrase --force -so ./key/validator-stake-account.json

    # check key generated
    solana address -k ./key/faucet-identity.json
    solana address -k ./key/validator-identity.json
    solana address -k ./key/validator-vote-account.json
    solana address -k ./key/validator-stake-account.json
    ```

1. genesis 파일 생성

    ```shell
    # download lib(so)
    ./bin/fetch-spl.sh

    # generate genesis
    sudo rm -r /app/test-ledger
    RUST_BACKTRACE=full solana-genesis \
        --ledger "/app/test-ledger" \
        --hashes-per-tick auto \
        --target-tick-duration 4000 \
        --faucet-lamports 500000000000000000 \
        --faucet-pubkey ./key/faucet-identity.json \
        --bootstrap-validator \
        "./key/validator-identity.json" \
        "./key/validator-vote-account.json" \
        "./key/validator-stake-account.json" \
        --cluster-type "mainnet-beta" \
        --rent-exemption-threshold 0.00001 \
        --bpf-program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA BPFLoader2111111111111111111111111111111111 spl_token-3.5.0.so \
        --upgradeable-program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb BPFLoaderUpgradeab1e11111111111111111111111 spl_token-2022-0.9.0.so none \
        --bpf-program Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo BPFLoader1111111111111111111111111111111111 spl_memo-1.0.0.so \
        --bpf-program MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr BPFLoader2111111111111111111111111111111111 spl_memo-3.0.0.so \
        --bpf-program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL BPFLoader2111111111111111111111111111111111 spl_associated-token-account-1.1.2.so \
        --bpf-program Feat1YXHhH6t1juaWF74WLcfv4XoNocjXA6sPWHNgAse BPFLoader2111111111111111111111111111111111 spl_feature-proposal-1.0.0.so

    # check genesis
    ls -l /app/test-ledger
    ```

1. docker-compose.yaml 파일

    ```shell
    # 위 key 생성 명령어 입력한 경로와 동일위치
    version: '2'

    services:
    validator:
        image: solanalabs/solana:v1.18.26
        restart: always
        # entrypoint: /usr/local/bin/solana-run.sh
        environment:
        - SOLANA_RPC_PORT=8899
        - SOLANA_DATA_DIR=/data/key
        - SOLANA_LEDGER_DIR=/data/ledger
        - SOLANA_FAUCET_KEY=faucet-identity.json
        - SOLANA_VALIDATOR_KEY=validator-identity.json
        - SOLANA_VALIDATOR_VOTE_KEY=validator-vote-account.json
        - SOLANA_VALIDATOR_STATE_KEY=validator-stake-account.json
        # - NDEBUG=profile
        volumes:
        - /app/test-ledger:/data/ledger  # Persist the ledger data
        - /app/test-ledger/config:/usr/bin/config
        - ./key:/data/key
        - ./bin/solana-run.sh:/usr/bin/solana-run.sh
        - ./spl_associated-token-account-1.1.2.so:/usr/local/bin/spl_associated-token-account-1.1.2.so
        - ./spl_feature-proposal-1.0.0.so:/usr/local/bin/spl_feature-proposal-1.0.0.so
        - ./spl_memo-1.0.0.so:/usr/local/bin/spl_memo-1.0.0.so
        - ./spl_memo-3.0.0.so:/usr/local/bin/spl_memo-3.0.0.so
        - ./spl_token-2022-0.9.0.so:/usr/local/bin/spl_token-2022-0.9.0.so
        - ./spl_token-3.5.0.so:/usr/local/bin/spl_token-3.5.0.so
        ports:
        - '8899:8899'
        - '8900:8900'
    explorer:
        image: solana-spe-explorer:latest
        ports:
        - '8080:3000'
    ```

    [docker-compose.yaml](./props/files/docker-compose.yml)

1. bin/solana-run.sh 파일

    [solana-run.sh](./props/files/solana-run.sh)

1. 노드 기동

    ```shell
    # tree 구조
    .
    ├── bin
    │   └── solana-run.sh
    ├── docker-compose.yml
    ├── key
    │   ├── faucet-identity.json
    │   ├── validator-identity.json
    │   ├── validator-stake-account.json
    │   └── validator-vote-account.json
    ├── spl_associated-token-account-1.1.2.so
    ├── spl_feature-proposal-1.0.0.so
    ├── spl_memo-1.0.0.so
    ├── spl_memo-3.0.0.so
    ├── spl_token-2022-0.9.0.so
    └── spl_token-3.5.0.so

    docker-compose up
    ```
