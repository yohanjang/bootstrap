#!/usr/bin/env bash
#
# Run a minimal Solana cluster.  Ctrl-C to exit.
#
# Before running this script ensure standard Solana programs are available
# in the PATH, or that `cargo build` ran successfully
#
set -e

# Prefer possible `cargo build` binaries over PATH binaries
script_dir="$(readlink -f "$(dirname "$0")")"
if [[ "$script_dir" =~ /scripts$ ]]; then
  cd "$script_dir/.."
else
  cd "$script_dir"
fi


profile=debug
if [[ -n $NDEBUG ]]; then
  profile=release
fi
PATH=$PWD/target/$profile:$PATH
echo ${PATH}

ok=true
for program in solana-{faucet,genesis,keygen,validator}; do
  $program -V || ok=false
done
$ok || {
  echo
  echo "Unable to locate required programs.  Try building them first with:"
  echo
  echo "  $ cargo build --all"
  echo
  exit 1
}

export RUST_LOG=${RUST_LOG:-solana=info,solana_runtime::message_processor=debug} # if RUST_LOG is unset, default to info
export RUST_BACKTRACE=1
# dataDir=$PWD/config/"$(basename "$0" .sh)"
dataDir=${SOLANA_DATA_DIR}
# ledgerDir=$PWD/config/ledger
ledgerDir=${SOLANA_LEDGER_DIR}

SOLANA_RUN_SH_CLUSTER_TYPE=${SOLANA_RUN_SH_CLUSTER_TYPE:-development}

set -x
if ! solana address; then
  # echo Generating default keypair 
  # solana-keygen new --no-passphrase
  echo Copy generated keypair 
  mkdir -p /root/.config/solana/
  cp ${dataDir}/${SOLANA_FAUCET_KEY} /root/.config/solana/id.json
fi
# validator_identity="$dataDir/validator-identity.json"
validator_identity="$dataDir/${SOLANA_VALIDATOR_KEY}"
if [[ -e $validator_identity ]]; then
  echo "Use existing validator keypair"
else
  solana-keygen new --no-passphrase -so "$validator_identity"
fi
# validator_vote_account="$dataDir/validator-vote-account.json"
validator_vote_account="$dataDir/${SOLANA_VALIDATOR_VOTE_KEY}"
if [[ -e $validator_vote_account ]]; then
  echo "Use existing validator vote account keypair"
else
  solana-keygen new --no-passphrase -so "$validator_vote_account"
fi
# validator_stake_account="$dataDir/validator-stake-account.json"
validator_stake_account="$dataDir/${SOLANA_VALIDATOR_STATE_KEY}"
if [[ -e $validator_stake_account ]]; then
  echo "Use existing validator stake account keypair"
else
  solana-keygen new --no-passphrase -so "$validator_stake_account"
fi

if [[ -e "$ledgerDir"/genesis.bin || -e "$ledgerDir"/genesis.tar.bz2 ]]; then
  echo "Use existing genesis"
  echo
  echo "Available SPL programs:"
  pwd
  ls -l spl_*.so
else
  ./fetch-spl.sh
#   /usr/bin/fetch-spl.sh
#   /usr/local/bin/fetch-spl.sh
  if [[ -r spl-genesis-args.sh ]]; then
    SPL_GENESIS_ARGS=$(cat spl-genesis-args.sh)
  fi

  # --faucet-lamports 500000000000000000 \
  #                   500000000123456789
  # shellcheck disable=SC2086
  solana-genesis \
    --hashes-per-tick sleep \
    --faucet-lamports 500000000000000000 \
    --bootstrap-validator \
      "$validator_identity" \
      "$validator_vote_account" \
      "$validator_stake_account" \
    --ledger "$ledgerDir" \
    --cluster-type "$SOLANA_RUN_SH_CLUSTER_TYPE" \
    $SPL_GENESIS_ARGS \
    $SOLANA_RUN_SH_GENESIS_ARGS
fi

abort() {
  set +e
  kill "$faucet" "$validator"
  wait "$validator"
}
trap abort INT TERM EXIT

solana-faucet &
faucet=$!

# args=(
#   --identity "$validator_identity"
#   --vote-account "$validator_vote_account"
#   --ledger "$ledgerDir"
#   --gossip-port 8001
#   --full-rpc-api
#   --rpc-port 8899
#   --rpc-faucet-address 127.0.0.1:9900
#   --log -
#   --enable-rpc-transaction-history
#   --enable-extended-tx-metadata-storage
#   --init-complete-file "$dataDir"/init-completed
#   --require-tower
#   --no-wait-for-vote-to-start-leader
#   --no-os-network-limits-test
# )
args=(
  --identity "${validator_identity}"
  --vote-account "${validator_vote_account}"
  --ledger "$ledgerDir"
  --full-rpc-api
  --rpc-port ${SOLANA_RPC_PORT}
  --rpc-faucet-address 127.0.0.1:9900
  --enable-rpc-transaction-history
  --enable-extended-tx-metadata-storage
  --init-complete-file "$dataDir"/init-completed
  --require-tower
  --no-wait-for-vote-to-start-leader
  --no-os-network-limits-test
  --dynamic-port-range 8192-32768
  --rpc-bigtable-timeout 30
  --rpc-max-multiple-accounts 100
  --rpc-threads 10
)
#   --gossip-port 8001
# shellcheck disable=SC2086

# solana config get
solana config set -ul
solana config set --keypair ${dataDir}/${SOLANA_FAUCET_KEY}
# solana config get

solana-validator "${args[@]}" $SOLANA_RUN_SH_VALIDATOR_ARGS &
validator=$!

wait "$validator"
