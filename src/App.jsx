import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { ConfigProvider, Flex, Layout, List, Image, Typography, Descriptions, Timeline } from 'antd'
const { Header, Footer, Sider, Content } = Layout
const { Title } = Typography

const headerStyle = {
  textAlign: 'center',
  color: '#fff',
  height: 60,
  paddingInline: 20,
  lineHeight: '10px',
  backgroundColor: '#2048bb',
};
const contentStyle = {
  textAlign: 'center',
  minHeight: 120,
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#0958d9',
};
const siderStyle = {
  textAlign: 'center',
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#bbbbbb',
};
const layoutStyle = {
  borderRadius: 8,
  overflow: 'hidden',
  width: 'calc(100% - 2px)',
  maxWidth: 'calc(100% - 2px)',
  height: 'calc(100% - 5px)'
};

let albumInfo = {
  jacketURL: "https://i.discogs.com/HuJE8Ak8vykYnA28p8RcJeYroEnoPuyPfd4p0g7ARDA/rs:fit/g:sm/q:90/h:500/w:500/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTczOTc2/ODQtMTQ0MDYyMTg0/NC04MTg4LmpwZWc.jpeg",
  titext: "Kalafina - WTF?xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  labelText: "SME Records - SEJL-28",
  formatText: "Vinyl, 12 33 RPM",
  countryText: "Japan",
  releasedText: "Aug 12, 2015",
  genreText: "Pop, stage",
  styext: "J-pop",
  prize: [0, 0, 0],
  sellsText: "6 copies from ¥11,377",
  haveWant: [10, 20],
  playList: [1, 2, 3, 4, 5, 4, 5, 6, 4, 2, 2, 3, 6, 6, 3, 63, 2]
}

function App() {
  const [count, setCount] = useState(0)
  return (
    <>
      <Layout style={layoutStyle}>
        <Sider width="25%" style={siderStyle}>
          <Flex vertical align='start' justify='start'>
            <UJacket jacketURL={jacketURL} fallBackURL={"public/error-image.png"} />
            <UPlayList playList={playList} />
          </Flex>
        </Sider>
        <Layout>
          <Header style={headerStyle}>
            <UTitle titleText={titleText} />
          </Header>
          <Content >
            <UAlbumData albumData={albumData} />
          </Content>
        </Layout>
      </Layout>
    </>
  )
}

function UJacket({ jacketURL, fallBackURL, onErrorFunc }) {
  return (
    <Image
      src={jacketURL}
      preview={false}
      fallback={fallBackURL} />)
}

function UPlayList({ playList }) {
  return (
    <ConfigProvider theme={{
      components: {
        List: {
          itemPaddingSM: 4,
          emptyTextPadding: 2
        }
      }
    }}>
      <List size="small"
        bordered dataSource={playList}
        renderItem={(item) => <List.Item>{item}</List.Item>} />
    </ConfigProvider>)
}

let ellipsisConfig = {
  rows: 1,
  expandable: false,
}

function UTitle({ titleText }) {
  return (
    <ConfigProvider theme={{
      components: {
        Typography: {
          titleMarginTop: "0em",
          titleMarginBottom: "0em"
        }
      }
    }} >
      <Title level={2} ellipsis={ellipsisConfig} style={{ color: "Black" }}>{titleText}</Title>
    </ConfigProvider>
  )
}
let APrize = [
  { children: prize[0] },
  { children: prize[1] },
  { children: prize[2] }
]

let albumData = [
  { key: "1", label: "厂牌", children: "SME" },
  { key: "2", label: "媒体形式", children: "Vinyl" },
  { key: "3", label: "发行地", children: "Japan" },
  { key: "4", label: "发售时间", children: "" },
  { key: "5", label: "类型", children: "" },
  { key: "6", label: "风格", children: "" },
  { key: "7", label: "价格", children: <Timeline pending="now prize" reverse items={APrize} /> },
  { key: "8", label: " ", children: "" },
  { key: "9", label: "持有&想要数", children: "" },
]

function UAlbumData({ albumData }) {
  return (
    <ConfigProvider>
      <Descriptions bordered items={albumData} size='small' />
    </ConfigProvider>
  )
}
export default App
