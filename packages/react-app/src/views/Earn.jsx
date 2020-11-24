import React, { useCallback, useEffect, useState } from "react";
import { Row, Descriptions, Col, Button, List, Select, Divider, Input, InputNumber, Card, DatePicker, Slider, Switch, Progress, Spin } from "antd";
import { Address, Roll, AddressInput, Balance, Faucet, EtherInput } from "../components";
import { useContractReader, useEventListener, useResolveName, useCustomContractLoader } from "../hooks";

export default function Earn({address, mainnetProvider, userProvider, localProvider, yourLocalBalance, price, tx, readContracts, writeContracts }) {
//Contract info loading
        const poolMinted = useEventListener(readContracts, "HPoolFactory", "PoolMinted", localProvider, 1);
        const dealerMinted = useEventListener(readContracts, "HDealerFactory", "DealerMinted", localProvider, 1);
        const { Option } = Select;
        const [selected, setSelected] = useState(0);
        const [dealer, setDealer] = useState(0);
        const poolContractReader = useCustomContractLoader(localProvider, "HPool", selected);
        const poolContractWriter = useCustomContractLoader(userProvider, "HPool", selected);
        const dealerReader = useCustomContractLoader(localProvider, "HDealer", dealer);
        const dealerWriter = useCustomContractLoader(userProvider, "HDealer", dealer);
        function onChange(value) {
                console.log('logging pool change');
                console.log(value);
                setSelected(value);
        }
        function dealOnChange(value) {
                console.log('logging dealer change');
                console.log(value);
                setDealer(value);
        }


        function onBlur() {
                console.log('blur');
        }

        function onFocus() {
                console.log('focus');
        }

        function onSearch(val) {
                  console.log('search:', val);
                  }
  return (
          <div style = {{border:"1px solid #CCCCCC", padding:16, width:400, margin:"auto", marginTop:32}}>
                       <Divider />

                                <Divider />
                <Descriptions title="Modify Your Bankroll Positions"/>
                <Select
                              showSearch
                                  style={{ width: 200 }}
                                 placeholder="Selected a Liquidity Pool"
                                 optionFilterProp="children"
                                 onChange={onChange}
                           onFocus={onFocus}
                           onBlur={onBlur}
                           onSearch={onSearch}
                                 filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                      {poolMinted.map(item=>(
                                              <Option key={item[0]} value={item[0]}>{item[0]}</Option>
                                      ))}
            </Select>
 
                                <br/>
                <br/>
                <Address
                        value={selected}
                        ensProvider={mainnetProvider}
                        fontSize={16}
                />
                <Balance
                        address={selected}
                        provider={localProvider}
                        dollarMultiplier={price}
                />

                <Divider />
                  <Divider />
                  <Button>Approve Pool</Button>

          </div>
  );
}