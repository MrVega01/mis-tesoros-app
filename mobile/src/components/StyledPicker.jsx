import { Picker } from '@react-native-picker/picker'
import { View, StyleSheet } from 'react-native'
import { theme } from '../theme'

export default function StyledPicker ({ style = {}, formValues, onChange, name, error, items, ...props }) {
  if (!formValues || !onChange || !name) return
  const containerStyle = [
    styles.container,
    error && styles.error,
    style
  ]
  return (
    <View style={containerStyle}>
      <Picker
        style={styles.picker}
        dropdownIconColor='#fff'
        selectedValue={formValues[name]}
        onValueChange={(itemValue) =>
          onChange(name, itemValue)}
        {...props}
      >
        <Picker.Item label='Selecciona un tipo' value={null} />
        {
          items.map(item => <Picker.Item key={item[1]} label={item[0]} value={item[1]} />)
        }
      </Picker>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 10
  },
  picker: {
    color: theme.colors.textPrimary
  },
  error: {
    borderColor: 'rgba(255, 0, 0, 0.5)'
  }
})
