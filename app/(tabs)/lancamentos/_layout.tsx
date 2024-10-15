import { Slot, Stack, Tabs } from 'expo-router';

export default function TabLayout() {
  
  return (
  
   <Stack screenOptions={ {animation: 'flip'} }>
      <Stack.Screen name='criar' options={{headerShown: true, title: 'Criar Lançamento'}}  /> 
   </Stack>
  
  );
}
