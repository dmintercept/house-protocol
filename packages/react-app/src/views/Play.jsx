import React, { useState, useContext } from "react";
import { Row, Descriptions, Col, Button, Select, Divider, InputNumber, Slider } from "antd";
import { E20Balance, Address, Roll, Ball } from "../components";
import { useEventListener, useCustomContractLoader } from "../hooks";
import { EthersContext } from "../context";

export default function Play({ address, mainnetProvider, localProvider, tx, readContracts, writeContracts }) {
  // Contract info loading
  const poolMinted = useEventListener(readContracts, "HPoolFactory", "PoolMinted", localProvider, 1);
  const dealerMinted = useEventListener(readContracts, "HDealerFactory", "DealerMinted", localProvider, 1);
  const { Option } = Select;
  const [pool, setPool] = useState(0);
  const [erc, setERC] = useState(0);
  const [chance, setChance] = useState(0);
  const [edge, setEdge] = useState(0);
  const [dealer, setDealer] = useState(0);
  const e20Contract = useCustomContractLoader(localProvider, "IERC20", erc);
  const context_value = useContext(EthersContext);
  console.log('context value: ', context_value);
  function onChange(key, value) {
    console.log("logging pool change");
    console.log("erc20: ", value.value);
    console.log("pool: ", value.key);
    setERC(value.value);
    setPool(value.key);
  }
  function dealOnChange(value) {
    console.log("logging dealer change");
    console.log(value);
    setDealer(value);
  }

  function chanceOnChange(value) {
    console.log("logging chance");
    setChance(value);
  }

  function edgeOnChange(value) {
    console.log("logging edge");
    setEdge(value);
  }

  function onBlur() {
    console.log("blur");
  }

  function onFocus() {
    console.log("focus");
  }

  function onSearch(val) {
    console.log("search:", val);
  }
  return (
    <div style={{ border: "1px solid #CCCCCC", padding: 16, width: 400, margin: "auto", marginTop: 32 }}>
      <Descriptions title="Choose your Dealer" />
      <Select
        showSearch
        style={{ width: 200 }}
        placeholder="Select your dealer"
        optionFilterProp="children"
        onChange={dealOnChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onSearch={onSearch}
        filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      >
        {dealerMinted.map(item => (
          <Option key={item[0]} value={item[0]}>
            {item[0]}
          </Option>
        ))}
      </Select>
      <br />
      <br />
      <Address value={dealer} ensProvider={mainnetProvider} fontSize={16} />

      <Divider />
      <Descriptions title="Select the Currency for Your Bet" />
      <Select
        showSearch
        style={{ width: 200 }}
        placeholder="pool a Liquidity Pool"
        optionFilterProp="children"
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onSearch={onSearch}
        filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      >
        {poolMinted.map(item => (
          <Option key={item[0]} value={item[1]}>
            {item[0]}
          </Option>
        ))}
      </Select>

      <br />
      <br />

      <E20Balance contract={e20Contract} address={address} provider={localProvider} />

      <Address value={address} ensProvider={mainnetProvider} fontSize={16} />

      <Divider />
      <Row>
        <Col span={4}>Edge</Col>
        <Col span={12}>
          <Slider min={0} max={100} onChange={edgeOnChange} value={edge} />
        </Col>
        <Col span={4}>
          <InputNumber style={{ marginLeft: 16 }} onChange={edgeOnChange} value={edge} />
        </Col>
      </Row>
      <Row>
        <Col span={4}>Chance</Col>
        <Col span={12}>
          <Slider min={0} max={100} onChange={chanceOnChange} value={chance} />
        </Col>
        <Col span={4}>
          <InputNumber style={{ marginLeft: 16 }} onChange={chanceOnChange} value={chance} />
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col span={4}>Bet Size</Col>
        <Col span={16}>
          <Roll
            tx={tx}
            edge={edge}
            chance={chance}
            poolAddress={pool}
            dealerAddress={dealer}
            writeContracts={writeContracts}
          />
        </Col>
      </Row>
      <Divider />
      <Row>
        <Ball />
      </Row>
      <Divider />
      <Button
        onClick={() => {
          console.log(dealer);
          tx(writeContracts.LinkTokenInterface.approve(dealer, "1000000000000000000000000000000000"));
        }}
      >
        Approve Link
      </Button>
      <Button
        onClick={() => {
          console.log(pool);
          tx(writeContracts.IERC20.approve(pool, "10000000000000000000000000000000000000"));
        }}
      >
        Approve Pool
      </Button>
    </div>
  );
}
