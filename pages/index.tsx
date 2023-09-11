import Image from "next/image";
import { Inter } from "next/font/google";
import { Lucid, Blockfrost } from "lucid-cardano";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

const projectId = "previewpk7DHYd9OCLdwAF0PuWVygYaN0cDuGy6";

export default function Home() {
  const [lucid, setLucid] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [tx, setTx] = useState(null);

  const requestAccessTo = async () => {
    try {
      setLoading(true);
      const _lucid = await Lucid.new(
        new Blockfrost(
          "https://cardano-preview.blockfrost.io/api/v0",
          projectId
        ),
        "Preview"
      );
      const api = await window.cardano.nami.enable();
      const wallet = _lucid.selectWallet(api);
      setLucid(wallet);
    } catch (error) {
      console.log("handling Request access failed: ", error);
    } finally {
      setLoading(false);
    }
  };

  const getBalance = async () => {
    try {
      setLoading(true);
      const utxos = await lucid.wallet.getUtxos();
      const lovelace = utxos.reduce(
        (amount, utxo) => amount + utxo.assets.lovelace,
        0n
      );

      setResults(lovelace.toString());
    } catch (error) {
      console.log("getting account Balance failed: ", error);
      setResults(error.message || error);
    } finally {
      setLoading(false);
    }
  };

  const getUtxos = async () => {
    try {
      setLoading(true);
      const utxos = await lucid.wallet.getUtxos();
      setResults(
        JSON.stringify(
          utxos.map((item) => {
            item.assets.lovelace = item.assets.lovelace.toString();
            return item;
          })
        )
      );
    } catch (error) {
      console.log("getting account utxos failed: ", error);
      setResults(error.message || error);
    } finally {
      setLoading(false);
    }
  };

  const createTx = async () => {
    try {
      setLoading(true);
      const recipient =
        "addr_test1qpfnvd95mppgpkp3hpwjwyg3aj2dy0swqy0ztuapqv5l07lry3xhrkkpqcqq0m3qzd9s7q698x5qqwflwjdekdvjrwlqrkqnpw";

      const lovelace = 1000000n;
      const tx = await lucid
        .newTx()
        .payToAddress(recipient, { lovelace })
        .complete();
      setTx(tx);
      setResults("create the tx successfully");
    } catch (error) {
      console.log("creating a tx  failed: ", error);
      setResults(error.message || error);
    } finally {
      setLoading(false);
    }
  };

  const signTx = async () => {
    try {
      setLoading(true);
      const signedTx = await tx.sign().complete();
      setTx(signedTx);
      setResults("sign the tx successfully");
    } catch (error) {
      setResults(error.message || error);
    } finally {
      setLoading(false);
    }
  };

  const submitTx = async () => {
    try {
      setLoading(true);
      const txHash = await tx.submit();
      setResults(txHash);
    } catch (error) {
      setResults(error.message || error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={` ${inter.className}`}>
      <div className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1 className="text-5xl text-center my-3">Cardano dApp Example</h1>
        {!lucid && (
          <div className="col-12 text-center my-3">
            <button
              className="px-4 py-2 font-semibold text-sm bg-sky-500 text-white rounded-md shadow-sm"
              onClick={requestAccessTo}
            >
              Request access to Nami
            </button>
          </div>
        )}

        <div className="grid gap-4 grid-cols-2 my-3">
          <div className="grid gap-4 grid-cols-1">
            <button
              disabled={!lucid}
              className="px-4 py-2 w-full  text-sm bg-gray-200 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={getBalance}
            >
              Get Account Balance
            </button>
            <button
              disabled={true}
              className="px-4 py-2 w-full  text-sm bg-gray-200 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Get Used Addresses
            </button>
            <button
              disabled={true}
              className="px-4 py-2 w-full  text-sm bg-gray-200 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Get Unused Addresses
            </button>
            <button
              className="px-4 py-2 w-full  text-sm bg-gray-200 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={true}
            >
              Get Change Addresses
            </button>
          </div>
          <div className="grid gap-4 grid-cols-1">
            <button
              disabled={!lucid}
              className="px-4 py-2 w-full  text-sm bg-gray-200 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={getUtxos}
            >
              Get Utxos
            </button>
            <button
              disabled={!lucid}
              className="px-4 py-2 w-full  text-sm bg-gray-200 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={createTx}
            >
              Create Tx
            </button>
            <button
              disabled={!tx}
              onClick={signTx}
              className="px-4 py-2 w-full  text-sm bg-gray-200 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sign Tx
            </button>
            <button
              disabled={!tx}
              className="px-4 py-2 w-full  text-sm bg-gray-200 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={submitTx}
            >
              Submit Tx
            </button>
          </div>
        </div>
        <div
          className={`rounded-lg w-2/3 p-4 break-all my-8  bg-orange-50 border border-orange-300`}
          style={{ minHeight: 120 }}
        >
          {results}
        </div>
      </div>
      {loading && (
        <div className="w-full h-full absolute top-0 bg-white opacity-50"></div>
      )}
      {loading && (
        <div className="absolute inset-1/2">
          <svg
            className="w-10 h-10 animate-spin -ml-1 mr-3 text-indigo-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}
    </main>
  );
}
