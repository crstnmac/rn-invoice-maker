import {Linking, Pressable, ScrollView, View} from 'react-native'
import React, {useRef, useState} from 'react'
import {Stack, router} from 'expo-router'
import {Button} from '~/components/ui/button'
import {Save, X} from 'lucide-react-native'
import {Input} from '~/components/ui/input'
import {Formik} from 'formik'
import {Label} from '~/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {
  BottomSheetHeader,
  BottomSheetView,
  useBottomSheet,
} from '~/components/ui/bottomsheet'
import {Calendar, toDateId} from '@marceloterreiro/flash-calendar'
import {BottomSheetModal} from '@gorhom/bottom-sheet'
import {TouchableWithoutFeedback} from 'react-native'
import {Text} from '~/components/ui/text'

import {printToFileAsync} from 'expo-print'

export default function AddInvoice() {
  const insets = useSafeAreaInsets()
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  }

  const [tempValue, setTempValue] = useState('')

  const [values, setValues] = useState({
    invoiceNumber: '',
    currency: '',
    dueDate: '',
    address: '',
    items: [],
    total: 0,
  })

  const printToPdf = async () => {
    const html = `
      <h1>Invoice</h1>
      <p>Invoice No: ${values.invoiceNumber}</p>
      <p>Currency: ${values.currency}</p>
      <p>Due Date: ${values.dueDate}</p>
      <p>Address: ${values.address}</p>
      <p>Items:</p>
      <ul>
        ${values.items.map((item) => `<li>${item}</li>`).join('')}
      </ul>

      <p>Total: ${values.total}</p>
    `

    const pdf = await printToFileAsync({
      html,
      width: 612,
      height: 792,
      base64: true,
    })

    router.push({
      pathname: '/pdf-viewer',
      params: {
        data: pdf.base64,
      },
    })
  }

  const {ref, open, close} = useBottomSheet()

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        paddingBottom: contentInsets.bottom,
        paddingLeft: contentInsets.left,
        paddingRight: contentInsets.right,
        flex: 1,
      }}
    >
      <Stack.Screen
        options={{
          title: 'Add Invoice',
          headerRight: () => {
            return (
              <Button
                variant="outline"
                size="icon"
                onPress={() => {
                  router.push('/add-invoice')
                }}
              >
                <Save color="#000" />
              </Button>
            )
          },
        }}
      />
      <Formik
        initialValues={values}
        onSubmit={(values) => {
          setValues(values)
        }}
      >
        {({handleChange, handleBlur, handleSubmit, setFieldValue, values}) => (
          <View className="flex-1">
            <View className="p-2 gap-2.5">
              <View>
                <Label nativeID="invoice-number">Invoice No</Label>
                <Input
                  onChangeText={handleChange('invoiceNumber')}
                  onBlur={handleBlur('invoiceNumber')}
                  value={values.invoiceNumber}
                />
              </View>

              <View>
                <Label nativeID="currency">Currency</Label>
                <Select
                  nativeID="currency-select"
                  onValueChange={(option) => {
                    setFieldValue('currency', option?.value)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue
                      nativeID="currency-value"
                      className="text-sm text-gray-500"
                      placeholder="Select currency"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem
                        nativeID="currency-inr"
                        className="text-sm text-gray-500"
                        value="inr"
                        label="INR"
                      />
                      <SelectItem
                        nativeID="currency-usd"
                        className="text-sm text-gray-500"
                        value="usd"
                        label="USD"
                      />
                      <SelectItem
                        nativeID="currency-eur"
                        className="text-sm text-gray-500"
                        value="eur"
                        label="EUR"
                      />
                      <SelectItem
                        nativeID="currency-gbp"
                        className="text-sm text-gray-500"
                        value="gbp"
                        label="GBP"
                      />
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </View>

              <Label nativeID="due-date">Due Date</Label>
              <Pressable onPress={open}>
                <Input
                  nativeID="due-date-input"
                  placeholder="Select due date"
                  value={values.dueDate}
                  onChangeText={handleChange('dueDate')}
                  editable={false}
                  onPressIn={open}
                />
              </Pressable>
            </View>

            <View className="p-2 gap-2.5">
              <Label nativeID="address">Address</Label>
              <Input
                nativeID="address-input"
                onChangeText={handleChange('address')}
                onBlur={handleBlur('address')}
                value={values.address}
                multiline
              />
            </View>

            <View className="p-2 gap-2.5">
              <Label nativeID="items">Items</Label>
              {values.items.length > 0 &&
                values.items.map((item, index) => (
                  <View
                    key={index}
                    className="flex-row border border-neutral-200 rounded-md w-full gap-2.5"
                  >
                    <Text className="flex-1 p-1.5  text-xl font-medium text-gray-500">
                      {item}
                    </Text>
                    <Button
                      variant="secondary"
                      size="icon"
                      onPress={() => {
                        const newItems = [...values.items]
                        newItems.splice(index, 1)
                        setFieldValue('items', newItems)
                      }}
                    >
                      <X color="#000" />
                    </Button>
                  </View>
                ))}
              <View className="flex-col gap-2.5">
                <Input
                  nativeID="items-input"
                  className="w-full"
                  onChangeText={(text) => setTempValue(text)}
                  value={tempValue}
                  placeholder='Enter item and press "Add" button to add it to the list.'
                />
                <Button
                  onPress={() => {
                    if (tempValue) {
                      const newItems: (string | never)[] = [...values.items]
                      newItems.push(tempValue)
                      setFieldValue('items', newItems)
                      setTempValue('')
                    }
                  }}
                >
                  <Text>Add</Text>
                </Button>
              </View>
            </View>

            <Button
              className="mt-auto mb-4"
              onPress={() => {
                handleSubmit()
                printToPdf()
              }}
            >
              <Text>Save</Text>
            </Button>

            <BottomSheetModal ref={ref} snapPoints={[400]} $modal>
              <BottomSheetView>
                <View className="ml-auto">
                  <TouchableWithoutFeedback onPress={close}>
                    <X color="#000" />
                  </TouchableWithoutFeedback>
                </View>
                <Calendar
                  calendarMonthId={toDateId(new Date())}
                  onCalendarDayPress={(date) => {
                    handleChange('dueDate')(date)
                    close()
                  }}
                />
              </BottomSheetView>
            </BottomSheetModal>
          </View>
        )}
      </Formik>
    </ScrollView>
  )
}
