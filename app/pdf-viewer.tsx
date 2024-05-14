import {View, Text} from 'react-native'
import React from 'react'

import Pdf from 'react-native-pdf'
import {useLocalSearchParams} from 'expo-router'

export default function PDFViewer() {
  const {data} = useLocalSearchParams()
  console.log(data)
  return (
    <View className="flex-1">
      <Text>PDF Viewer</Text>
      <Pdf
        source={{
          uri: `data:application/pdf;base64,${data}`,
        }}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`number of pages: ${numberOfPages}`)
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`current page: ${page}`)
        }}
        onError={(error) => {
          console.log(error)
        }}
        onPressLink={(uri) => {
          console.log(`Link pressed: ${uri}`)
        }}
        style={{flex: 1, width: '100%'}}
      />
    </View>
  )
}
