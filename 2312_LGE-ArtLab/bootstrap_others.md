# Other tools
## Docker in Ubuntu 20.04
### Prerequisites
1. __CNS 내부망에서 진행 시 신뢰된 인증서 추가__
    - <code>openssl x509 -in ~/LG_CNS-CA.cer -out ~/LG_CNS-CA.crt</code>
    - <code>mkdir -p /usr/share/ca-certificates/extra && cd $_</code>
    - <code>cp ~/LG_CNS-CA.* .</code>
    - <code>#update-ca-trust</code>
    - <code>sudo dpkg-reconfigure ca-certificates</code>
    <br/>&nbsp;&nbsp;
1. __shard directory__
    - <code># /etc/profile (혹은 ~/.profile , ~/.bash_rc 등) 추가</code>
    - <code>if [ ! -d /mnt/ws/src ]; then
  &nbsp;&nbsp;sudo mount -t vboxsf ws /mnt/ws
  &nbsp;&nbsp;ln -sf /mnt/ws/src/ /monachain
fi</code>
### install
1. __apt update && install tools__
    - <code>sudo apt update</code>
    - <code>sudo apt install apt-transport-https ca-certificates curl gnupg-agent software-properties-common net-tools</code>
    - <code>curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -</code>
    <br/>&nbsp;&nbsp;
1. __set up docker repository__
    - <code>sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu \$(lsb_release -cs) stable"</code>
    - <code>sudo apt-get update</code>
    <br/>&nbsp;&nbsp;
1. __uninstall old versions__
    - <code>for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove $pkg; done</code>
    <br/>&nbsp;&nbsp;
1. __install docker__
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
1. __check install docker__
    - <code>docker version</code>
    <br/>&nbsp;&nbsp;
1. __install docker-compose__
    - <code>COMPOSE_VERSION_V1=1.29.2</code>
    - <code>COMPOSE_VERSION_V2=v2.24.0</code>
    - <code>sudo curl -L "https://github.com/docker/compose/releases/download/${COMPOSE_VERSION_V1}/docker-compose-$(uname -s)-\$(uname -m)" -o /usr/local/bin/docker-compose_v1</code>
    - <code>sudo curl -L "https://github.com/docker/compose/releases/download/${COMPOSE_VERSION_V2}/docker-compose-$(uname -s)-\$(uname -m)" -o /usr/local/bin/docker-compose_v2</code>
    - <code>sudo chmod +x /usr/local/bin/docker-compose_v1 /usr/local/bin/docker-compose_v2</code>
    - <code>sudo ln -sf /usr/local/bin/docker-compose_v2 /usr/local/bin/docker-compose</code>
    <br/>&nbsp;&nbsp;
1. __check installed docker-compose__
    - <code>docker-compose version</code>
    <br/>&nbsp;&nbsp;
## Use symbolick link in window shared directory
### Prerequisites
1. 공유폴더에서 symbolic link 사용하도록 수정
    1. <code># 관리자 권한으로 cmd창 열기</code>
    1. <code>## VirtualBox 설치 디렉토리 이동</code>
        - <code>cd "C:\Program Files\Oracle\VirtualBox"</code>
    1. <code>## 설정 방법</code>
        - <code>VBoxManage setextradata [vm명] VBoxInternal2/SharedFoldersEnableSymlinksCreate/[Sharename] 1</code>
        - <code>ex) VBoxManage setextradata Ubuntu_ethereum VBoxInternal2/SharedFoldersEnableSymlinksCreate/ws 1</code>
    1. <code>## 설정 확인방법</code>
        - <code>VBoxManage getextradata [vm명] VBoxInternal2/SharedFoldersEnableSymlinksCreate/[Sharename]</code>
        - <code>ex) VBoxManage getextradata Ubuntu_ethereum VBoxInternal2/SharedFoldersEnableSymlinksCreate/ws</code>
    <br/>&nbsp;&nbsp;
    1. <code>## Windows 기능 켜기/끄기</code>
        - <code>[Linux용 Windows 하위 시스템] 기능 켜기</code>
    1. <code>## 사용자 symbolic link 권한 추가</code>
        - <code>win + r >> secpol.msc</code>
        - <code>[메뉴] 로컬 정책 >> 사용자 권한 할당</code>
        - <code>[정책] 심볼 링크 만들기 >> 사용자 또는 그룹 추가 >> 이름(조직 사용자명, 혹은 메일계정/사번) 입력 후 이름 체크 후 확인</code>
