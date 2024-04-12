import { useState } from 'react'

import Axios from 'axios'
import './App.css'

import { message, ConfigProvider, Flex, Layout, List, Image, Typography, Descriptions, Timeline, Input, Steps } from 'antd'
const { Header, Footer, Sider, Content } = Layout
const { Search } = Input

playList: [1, 2, 3, 4, 5, 4, 5, 6, 4, 2, 2, 3, 6, 6, 3, 63, 2]

function App() {
  const [info, setInfo] = useState([
    "专辑标题",
    [
      { key: '1', label: '厂牌', children: '唱片发行厂牌', span: 3 },
      { key: '2', label: '格式', children: '媒体形式', span: 3 },
      { key: '3', label: '发行地', children: '国家或地区', span: 2 },
      { key: '4', label: '发售时间', children: '年 月 （日）' },
      { key: '5', label: '分类', children: '大分类', span: 2 },
      { key: '6', label: '持有数据', children: '4402人拥有，2452人想要', span: 1 },
      { key: '7', label: '风格', children: '小分类', span: 2 },
      { key: '8', label: '当前售卖', children: '1 copies for 10000', span: 1 },
      {
        key: '9', label: '历史价格区间', children:
          <Steps progressDot current={3} items={[
            { title: '最低价格', description: '2000￥' },
            { title: '平均价格', description: '3330￥' },
            { title: '最高价格', description: '5000￥' },
          ]}>
          </Steps>, span: 3
      }
    ],
    "URL",
    [1, 2, 3, 4, 5]]
  )

  return (
    <>
      <Layout style={{
        borderRadius: 4,
        overflow: 'hidden',
        width: 'calc(100% - 2px)',
        maxWidth: 'calc(100% - 2px)',
        height: 'calc(100% - 5px)'
      }}>
        <Sider width="25%" style={{
          textAlign: 'center',
          lineHeight: '120px',
          color: 'white',
          backgroundColor: 'white',
          border: '3px solid black'
        }}>
          <Flex vertical align='start' justify='start'>
            <UJacket jacketURL={info[2]} fallBackURL={"error-image.png"} />
            <UPlayList playList={info[3]} />
          </Flex>
        </Sider>
        <Layout>
          <Header style={{
            padding: 5,
            textAlign: 'center',
            alignItems: 'start',
            height: 40,
            lineHeight: '30px',
            backgroundColor: '#FFFFFF',
            border: "3px solid black"
          }}>
            <UTitle info={info} />
          </Header>
          <Content style={{
            textAlign: 'center',
            minHeight: 120,
            lineHeight: '120px',
            color: 'white',
            backgroundColor: 'white',
            border: "3px solid black"
          }}>
            <Flex vertical>
              <UAlbumData info={info} />
              <USearchID info={info} setInfo={setInfo} />
            </Flex>
          </Content>
        </Layout>
      </Layout >
    </>
  )
}

function UJacket({ jacketURL, fallBackURL }) {
  return (
    <Image
      src={jacketURL}
      preview={false}
      fallback={fallBackURL} />)
}

function UPlayList({ playList }) {
  return (
    <List size="small"
      bordered dataSource={playList}
      style={{
        overflow: "auto",
        height: 400,
        textAlign: 'left'
      }}
      renderItem={(item) => <List.Item>{item}</List.Item>} />
  )
}

let ellipsisConfig = {
  rows: 1,
  expandable: false,
}

function UTitle({ info }) {
  return (
    <span style={{
      color: "Black",
      display: "inline-block",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      fontFamily: "font-title",
      fontSize: "20px",
      width: "calc(100%)"
    }}>{info[0]}</span>
  )
}

function UAlbumData({ info }) {
  return (
    <ConfigProvider>
      <Descriptions bordered items={info[1]} size='small' />
    </ConfigProvider>
  )
}

function USearchID({ info, setInfo }) {
  async function onSearch(value, _e, info) {
    let form = new FormData()

    form.append('id', value.replace(/[^0-9]/ig, ""))
    message.loading('加载中，请不要多次搜索。')
    await Axios.post('/album', form)
      .then((response) => {
        let temp = []
        for (let i = 0; i < response.data['pos'].length; i++) {
          temp.push(response.data['pos'][i] + "  :  " + response.data['title'][i])
        }
        setInfo([
          response.data['name'],
          [
            { key: '1', label: '厂牌', children: response.data['label'], span: 3 },
            { key: '2', label: '格式', children: response.data['format'], span: 3 },
            { key: '3', label: '发行地', children: response.data['country'], span: 2 },
            { key: '4', label: '发售时间', children: response.data['released'] },
            { key: '5', label: '分类', children: response.data['genre'], span: 2 },
            {
              key: '6', label: '持有数据', children: response.data['have'] + '人拥有，'
                + response.data['want'] + '人想要', span: 1
            },
            { key: '7', label: '风格', children: response.data['style'], span: 2 },
            { key: '8', label: '当前售卖', children: response.data['sells'], span: 1 },
            {
              key: '9', label: '历史价格区间', children:
                <Steps progressDot current={3} items={[
                  { title: '最低价格', description: response.data['low'] },
                  { title: '平均价格', description: response.data['median'] },
                  { title: '最高价格', description: response.data['high'] },
                ]}>
                </Steps>, span: 3
            }
          ],
          response.data['jacket_url'],
          temp
        ])
      })
  }
  return (
    <Search placeholder="paste album id copied form discogs" onSearch={onSearch} enterButton />
  )
}
export default App
