import {FlashList, ListRenderItem} from '@shopify/flash-list'
import {Stack, router} from 'expo-router'
import {FilePlus2Icon} from 'lucide-react-native'
import * as React from 'react'
import {View} from 'react-native'
import {Button} from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import {Text} from '~/components/ui/text'

interface Invoice {
  id: string
  title: string
  description: string
  amount: number
  status: 'paid' | 'unpaid'
}

export default function Screen() {
  const [invoices, setInvoices] = React.useState<Invoice[]>([
    {
      id: '1',
      title: 'Invoice #1',
      description: 'This is the first invoice',
      amount: 100,
      status: 'unpaid',
    },
    {
      id: '2',
      title: 'Invoice #2',
      description: 'This is the second invoice',
      amount: 200,
      status: 'paid',
    },
  ])

  const renderItem: ListRenderItem<Invoice> = ({item}) => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{item.title}</CardTitle>
          <CardDescription>{item.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Text>
            Amount: <Text>${item.amount}</Text>
          </Text>
        </CardContent>
        <CardFooter>
          <Text>{item.status === 'paid' ? 'Paid' : 'Unpaid'}</Text>
        </CardFooter>
      </Card>
    )
  }

  return (
    <View className="flex-1 gap-5 p-6 bg-secondary/30">
      <Stack.Screen
        options={{
          title: 'Invoice Maker',
          headerRight: () => (
            <View className="flex-row items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                className="flex-row gap-2"
                onPress={() => {
                  // Navigate to the add-invoice screen.
                  router.push('/add-invoice')
                }}
              >
                <FilePlus2Icon size={24} color="#000" />
              </Button>
            </View>
          ),
        }}
      />
      <FlashList
        data={invoices}
        estimatedItemSize={200}
        ItemSeparatorComponent={() => <View className="h-2" />}
        renderItem={renderItem}
      />
    </View>
  )
}
