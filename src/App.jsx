import { useState } from 'react'
import Axios from 'axios'
import './App.css'
import { message, ConfigProvider, Flex, Layout, List, Image, Descriptions, Input, Steps } from 'antd'
import { blue } from '@ant-design/colors'
const { Header, Sider, Content } = Layout
const { Search } = Input

function App() {
  const [info, setInfo] = useState([
    "专辑标题",
    [
      { key: '1', label: '厂牌', children: '唱片发行厂牌', span: 3 },
      { key: '2', label: '格式', children: '媒体形式', span: 3 },
      { key: '3', label: '发行地', children: '国家或地区', span: 2 },
      { key: '4', label: '发售时间', children: '年 月 （日）' },
      { key: '5', label: '分类', children: '大分类', span: 2 },
      { key: '6', label: '持有数据', children: '0人拥有，0人想要', span: 1 },
      { key: '7', label: '风格', children: '小分类', span: 2 },
      { key: '8', label: '当前售卖', children: '1 copies for 10000', span: 1 },
      {
        key: '9', label: '价格区间', children: <span></span>
      }
    ],
    "URL",
    [1, 2, 3, 4, 5]]
  )

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Descriptions: {
              fontSize: '15px',
            },
            List: {
              colorBorder: blue[6]
            },
            Steps: {
            },
            Input:
            {
              color: blue[6],
              colorPrimary: blue.primary,
              colorBorder: blue[6]
            }
          },
        }}
      >
        <Layout style={{
          borderRadius: 4,
          // overflow: 'hidden',
          width: '100%',
          height: '92vh',
          maxHeight: '93vh',
          border: '2px solid ' + blue.primary,
          display: 'flex'
        }}>
          <Sider width="25%" style={{
            backgroundColor: blue[3],
            minHeight: '100%',
          }}>
            <Flex vertical align='center' justify='start' style={{ Height: '100%', width: '100%' }}>
              <UJacket jacketURL={info[2]} fallBackURL={"error-image.png"} />
              <UPlayList playList={info[3]} />
            </Flex>
          </Sider>
          <Layout>
            <Header style={{
              padding: 5,
              textAlign: 'center',
              alignItems: 'start',
              height: 50,
              lineHeight: '40px',
              backgroundColor: blue[6],
            }}>
              <UTitle info={info} />
            </Header>
            <Content style={{
              textAlign: 'center',
              minHeight: 120,
              lineHeight: '120px',
              color: 'white',
              backgroundColor: blue[0],
            }}>
              <Flex vertical style={{ height: '100%' }}>
                <UAlbumData info={info} />
                <div style={{ margin: '3px', padding: '20px', border: '4px solid' + blue[3], height: '100%' }}>
                  <h1 style={{ color: 'black' }}>ZONE FOR WEBCAM</h1>
                  <USearchID info={info} setInfo={setInfo} />
                </div>
              </Flex>
            </Content>
          </Layout>
        </Layout >
      </ConfigProvider>
    </>
  )
}

function UJacket({ jacketURL, fallBackURL }) {
  return (
    <Image
      src={jacketURL}
      preview={false}
      width='87%'
      fallback={fallBackURL}
      style={{
        border: '5px solid ' + blue[6],
        objectFit: 'cover'
      }} />)
}

function UPlayList({ playList }) {
  return (
    <List size="small"
      bordered dataSource={playList}
      style={{
        background: blue[0],
        overflow: "auto",
        height: 'auto',
        //maxHeight: '100%',
        textAlign: 'left',
        width: '100%'
      }}
      renderItem={(item) => <List.Item>{item}</List.Item>} />
  )
}

function UTitle({ info }) {
  return (
    <span style={{
      color: "white",
      display: "inline-block",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      fontFamily: "font-title",
      fontSize: "30px",
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
              key: '9', label: '价格区间', children:
                <Steps progressDot current={7} size='small' items={[
                  { title: response.data['P'] + '￥', description: 'Poor' },
                  { title: response.data['F'] + '￥', description: 'Fair' },
                  { title: response.data['G'] + '￥', description: 'Good' },
                  { title: response.data['G+'] + '￥', description: 'Good+' },
                  { title: response.data['VG'] + '￥', description: 'Very Good' },
                  { title: response.data['VG+'] + '￥', description: 'Very Good+' },
                  { title: response.data['M-'] + '￥', description: 'Mint-' },
                  { title: response.data['M'] + '￥', description: 'Mint' },
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
