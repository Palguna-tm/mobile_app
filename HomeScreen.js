import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';
import AboutUsScreen from './AboutUsScreen';

const screenWidth = Dimensions.get('window').width;

const HomeScreen = ({ navigation }) => {
  const [todayUsage, setTodayUsage] = useState(0);
  const [weekUsage, setWeekUsage] = useState(0);
  const [monthUsage, setMonthUsage] = useState(0);
  const [forecastUsage, setForecastUsage] = useState(0);

  

  const [barChartData, setBarChartData] = useState({ labels: [], datasets: [{ data: [] }] });
  const [selectedCalendar, setSelectedCalendar] = useState('0');
  const [chartHeading, setChartHeading] = useState('');
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
 
  const [fetchedData, setFetchedData] = useState([]);

  const handleNotificationPress = () => {};

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 12) {
      return ' Good Morning.! ☀️';
    } else if (hour >= 12 && hour < 16) {
      return ' Good Afternoon.! 🌤️';
    } else if (hour >= 16 && hour < 22) {
      return ' Good Evening🌙';
    } else {
      return ' Good Night.! 🌜';
    }
  };

  const UsageCard = ({ title, data }) => {
    return (
      <View style={[styles.card]}>
        <Text style={[styles.cardTitle, { color: 'black' }]}>{title}</Text>
        <Text numberOfLines={1} style={[styles.cardData, { color: 'black', fontWeight: 'bold' }]}>{data}</Text>
      </View>
    );
  };
  
  
  
  const getGreetingAnimation = () => {
    const greetingText = getGreeting();
    let animatedGreeting = '';
    let index = 0;
    const interval = setInterval(() => {
      if (index < greetingText.length) {
        animatedGreeting += greetingText[index];
        setGreeting(animatedGreeting);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100); 
  };
  



  const handleMenuPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleProfilePress = () => {
    console.log('Profile icon pressed');
    navigation.navigate('Profile');
  };

  const handleLogoutPress = () => {
    navigation.navigate('Login');
  };

  const handleBarGraphPress = () => {
    navigation.navigate('Report');
  };

  const handleRealTimeGraphPress = () => {
    navigation.navigate('RealTimeGraph');
  };
  const Tooltip = ({ visible, x, y, value }) => {
    if (!visible || x === null || y === null) return null;
  
    
    const tooltipPositionY = y - 50; 
    
    return (
      <View style={[styles.tooltipContainer, { left: x, top: tooltipPositionY }]}>
        <Text style={styles.tooltipText}>{value} l</Text>
      </View>
    );
  };
  
  
  

  


  const handleAboutUsPress = () => {
    navigation.navigate('AboutUs');
  };

  const handleTooltipPress = (value, x, y) => {
    setTooltipData({ value, x, y });
    setTooltipVisible(true);
  };
  

  const hideTooltip = () => {
    setTooltipVisible(false);
  };

   

  const handleCalendarClick = (calendar) => {
    console.log('Clicked calendar:', calendar);
    setSelectedCalendar(calendar);
    switch (calendar) {
      case 'today':
        setBarChartDataAndHeading('today', 'Consumption Chart for Today');
        break;
      case 'week':
        setBarChartDataAndHeading('week', 'Consumption Chart for Week');
        fetchweekData(); 
        break;
      case 'month':
        setBarChartDataAndHeading('month', 'Consumption Chart for Month');
        fetchMonthData();
        break;
      case 'forecast':
        setBarChartDataAndHeading('forecast', 'Forecast Consumption Chart');
        break;
      default:
        break;
    }
  };
  const setBarChartDataAndHeading = async (calendarType, heading) => {
    let url = '';
    console.log('Setting chart heading:', heading);
    
    switch (calendarType) {
        case 'today':
            url = 'http://192.168.0.60:3001/ahp/data/allday/AHPA5*';
            break;
        case 'week':
            url = 'http://192.168.0.60:3001/ahp/data/week/AHPA5'; 
            break;
        case 'month':
            url = 'http://192.168.0.60:3001/ahp/data/monthall/AHPA5*'; 
            break;
        case 'forecast':
            url = 'http://192.168.0.60:3001/ahp/data/monthall/AHPA5*';
            break;
        default:
            break;
    }
    
    try {
        const response = await fetch(url);
        let responseData = await response.json();
  
        console.log('Received data:', responseData); // Log the received data
        
        if (calendarType === 'today' && Array.isArray(responseData)) {
            // Get the latest 10 entries
            responseData = responseData.slice(-7);

            let labels = [];
            let data = [];
  
            responseData.forEach(entry => {
                labels.push(entry.consumption_date);
                data.push(parseFloat(entry.daily_consumption));
            });
  
            // Update the chart data and heading for today's consumption
            const chartData = {
                labels: labels,
                datasets: [{
                    data: data
                }]
            };
            setBarChartData(chartData);
            setChartHeading(heading);
          }
            else if ((calendarType === 'week' || calendarType === 'forecast') && Array.isArray(responseData)) {
            let labels = [];
            let data = [];
  
            responseData.forEach(entry => {
                labels.push(entry.week);
                data.push(parseFloat(entry.total_consumption));
            });
  
            // Display total consumption for the week or forecast
            const totalConsumption = data.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            console.log(`Total ${calendarType === 'week' ? 'Week' : 'Forecast'} Consumption:`, totalConsumption);

            // Calculate average consumption for forecast
            let averageConsumption = 0;
            if (calendarType === 'forecast') {
                averageConsumption = totalConsumption / data.length;
                console.log('Average Forecast Consumption:', averageConsumption);
            }
  
            const chartData = {
                labels: labels,
                datasets: [{
                    data: data
                }]
            };
            setBarChartData(chartData);
            setChartHeading(heading);
        } else if (calendarType === 'month' && Array.isArray(responseData)) {
            let labels = [];
            let data = [];
  
            responseData.forEach(entry => {
                labels.push(entry.device_id);
                data.push(parseFloat(entry.total_consumption));
            });
  
            // Display total consumption for the month
            const totalConsumption = data.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            console.log('Total Month Consumption:', totalConsumption);
  
            const chartData = {
                labels: labels,
                datasets: [{
                    data: data
                }]
            };
            setBarChartData(chartData);
            setChartHeading(heading);
        } else {
            console.error('Error fetching chart data: Response data array not found');
        }
    } catch (error) {
        console.error('Error fetching chart data:', error);
    }
};

  
  useEffect(() => {
    fetchtodayData();
    fetchMonthData();
    fetchweekData();
    fetchForecastData();
  }, []);


  const fetchtodayData = async () => {
    try {
      const response = await fetch('http://192.168.0.60:3001/ahp/data/day/AHPA5*');
      const data = await response.json();
  
      if (data.hasOwnProperty('totalFinalConsumption')) {
        // Today's consumption data format
        const todayConsumption = parseFloat(data.totalFinalConsumption);
        console.log('Today\'s Consumption:', todayConsumption);
  
        // Update the today usage
        setTodayUsage(todayConsumption.toFixed(2) + ' ltrs');
      } else {
        console.error('Error: "totalFinalConsumption" property not found in response data');
      }
    } catch (error) {
      console.error('Error fetching card data:', error);
    }
  };
  
  

  const fetchweekData = async () => {
    try {
      const response = await fetch('http://192.168.0.60:3001/ahp/data/currentweek/AHPA5*');
      const data = await response.json();
      
      let totalWeekUsage = 0;
      if (data.hasOwnProperty('total_consumption')) {
          totalWeekUsage = parseFloat(data.total_consumption);
          setWeekUsage(totalWeekUsage.toFixed(2) + ' ltrs');
      } else {
          console.error('Error: Empty or invalid response data');
      }
  } catch (error) {
      console.error('Error fetching week data:', error);
  }
};

const fetchMonthData = async () => {
  try {
    const response = await fetch('http://192.168.0.60:3001/ahp/data/month/AHPA5*');
    const data = await response.json();

    if (data && typeof data.total_consumption === 'number') {
      // Extract total consumption for the month
      const totalMonthConsumption = data.total_consumption.toFixed(2);
      console.log('Total Month Consumption:', totalMonthConsumption);

      setMonthUsage(totalMonthConsumption + ' ltrs'); // Set month usage
    } else {
      console.error('Error: Invalid response data');
    }
  } catch (error) {
    console.error('Error fetching month data:', error);
  }
};


const fetchForecastData = async () => {
  try {
    const response = await fetch('http://192.168.0.60:3001/ahp/data/week/AHPA5');
    const data = await response.json();
    
    // Initialize variables to calculate the total and count of weeks
    let totalConsumption = 0;
    let weekCount = 0;
    
    // Iterate over each entry in the data array
    data.forEach(entry => {
      // Add the total consumption for the week to the total
      totalConsumption += parseFloat(entry.total_consumption);
      // Increment the week count
      weekCount++;
    });
    
    // Calculate the average consumption
    const averageConsumption = totalConsumption / weekCount;
    
    // Set the forecast usage
    setForecastUsage(Math.round(averageConsumption / 1) + ' ltrs');
    
  } catch (error) {
    console.error('Error fetching forecast data:', error);
  }
};




// Call fetchMonthData to fetch month data
fetchMonthData();

// Call fetchForecastData to fetch forecast data
fetchForecastData();

  // Bar chart decorator to display consumption data above bars
  const barChartDecorator = ({ x, y, index }) => (
    <View key={index} style={styles.barLabel}>
      <Text style={{ fontSize: 12, color: 'black' }}>
        {barChartData.datasets[0].data[index]} l
      </Text>
    </View>
  )
 
  const Footer = () => {
    return (
      <View style={styles.footer}>
        <TouchableOpacity onPress={handleRealTimeGraphPress} style={styles.footerIcon}>
          <MaterialCommunityIcons name="chart-line" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleBarGraphPress} style={styles.footerIcon}>
          <MaterialCommunityIcons name="chart-bar" size={24} color="black" />
        </TouchableOpacity>

        <View style={styles.circleContainer}>
          <TouchableOpacity onPress={() => console.log('Home icon pressed')} style={styles.homeIcon}>
            <MaterialCommunityIcons name="home" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleAboutUsPress} style={styles.footerIcon}>
          <MaterialCommunityIcons name="information-outline" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleProfilePress} style={styles.footerIcon}>
          <MaterialCommunityIcons name="account-circle" size={24} color="black" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
     <View style={styles.header}>
  <View style={styles.triangle} />
  
  <TouchableOpacity onPress={handleMenuPress} style={styles.logoContainer}>
    <Image source={require('./images/9.jpg')} style={styles.logo} />
  </TouchableOpacity>
  
  <View style={styles.centerText}>
    <Text style={styles.centerTextContent}>AHP FLAT NO: AGHPA05</Text>
  </View>
  
  <TouchableOpacity onPress={handleNotificationPress} style={styles.iconContainer}>
    <MaterialCommunityIcons name="bell-outline" size={24} color="black" style={styles.bellOutline} />
  </TouchableOpacity>
  
  <TouchableOpacity onPress={handleLogoutPress} style={styles.iconContainer}>
    <MaterialCommunityIcons name="power" size={24} color="black" />
  </TouchableOpacity>
</View>
<View style={styles.greetingContainer}>
  <Text style={styles.greetingText}>{getGreeting()}</Text>
  <Text style={styles.userName}>Arokia Raj...</Text>
  <Text style={styles.Flatno}>Know your Daily Usage - A05...!</Text>
</View>


      <View style={styles.calendarContainer}>
        <View style={styles.circleContainer}>
          <View style={styles.circleOutline}>
            <TouchableOpacity onPress={() => handleCalendarClick('today')} style={styles.circle}>
              <MaterialCommunityIcons name="calendar" size={24} color={selectedCalendar === 'today' ? 'orange' : 'black'} />
            </TouchableOpacity>
          </View>
          <Text style={styles.todayText}>Today</Text>
        </View>

        <View style={{ width: 20 }} />

        <View style={styles.circleContainer}>
          <View style={styles.circleOutline}>
            <TouchableOpacity onPress={() => handleCalendarClick('week')} style={styles.circle}>
            <MaterialCommunityIcons name="calendar" size={24} color={selectedCalendar === 'week' ? 'purple' : 'black'} />
            </TouchableOpacity>
          </View>
          <Text style={styles.weekText}>Week</Text>
        </View>

        <View style={{ width: 20 }} />

        <View style={styles.circleContainer}>
          <View style={styles.circleOutline}>
            <TouchableOpacity onPress={() => handleCalendarClick('month')} style={styles.circle}>
              <MaterialCommunityIcons name="calendar" size={24} color={selectedCalendar === 'month' ? 'purple' : 'black'} />
            </TouchableOpacity>
          </View>
          <Text style={styles.monthText}>Month</Text>
        </View>

        <View style={{ width: 20 }} />
        
        <View style={styles.circleContainer}>
          <View style={styles.circleOutline}>
            <TouchableOpacity onPress={() => handleCalendarClick('forecast')} style={styles.circle}>
              <MaterialCommunityIcons name="chart-line" size={24} color={selectedCalendar === 'forecast' ? 'brown' : 'black'} />
            </TouchableOpacity>
          </View>
          <Text style={styles.forecastText}>Forecast</Text>
        </View>
      </View>

      <View style={styles.imageContainer}>
  <View style={styles.imageAndExtraImageContainer}>
    <Image
      source={require('./images/ttt.gif')}
      style={styles.image}
    />
  
   
  </View>

  <View style={styles.cardContainer}>
  <View style={styles.usageItem}>
    <FontAwesome name="flash" size={20} color="yellow" style={styles.icon} />
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={[styles.usageText, { textAlign: 'justify', }]}>Todays Usage:</Text>
    </View>
    <Text style={[styles.usageValue, { textAlign: 'justify' }]}>{todayUsage}</Text>
  </View>
  <View style={styles.usageItem}>
    <FontAwesome name="clock-o" size={20} color="brown" style={styles.icon} />
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={[styles.usageText, { textAlign: 'justify'}]}>Week Usage:</Text>
    </View>
    <Text style={[styles.usageValue, { textAlign: 'justify' }]}>{weekUsage}</Text>
  </View>
  <View style={styles.usageItem}>
    <FontAwesome name="calendar" size={20} color="green" style={styles.icon} />
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={[styles.usageText, { textAlign: 'justify'}]}>Month Usage:</Text>
    </View>
    <Text style={[styles.usageValue, { textAlign: 'justify' }]}>{monthUsage}</Text>
  </View>
  <View style={styles.usageItem}>
    <FontAwesome name="line-chart" size={20} color="purple" style={styles.icon} />
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={[styles.usageText, { textAlign: 'justify'}]}>Forecast Usage:</Text>
    </View>
    <Text style={[styles.usageValue, { textAlign: 'justify' }]}>{forecastUsage}</Text>
  </View>
</View>

 
</View>

<View style={styles.barChartContainer}>
  <Text style={styles.chartHeading}>{chartHeading}</Text>
  
  <BarChart
    data={{
      labels: barChartData.labels,
      datasets: [
        {
          data: barChartData.datasets[0].data,
        },
      ],
    }}
    width={screenWidth - 32}
    height={200}
    chartConfig={{
      backgroundColor: '#fff',
      backgroundGradientFrom: '#fff',
      backgroundGradientTo: '#fff',
      fillShadowGradient: 'rgba(30, 158, 255, 0.7)',
      fillShadowGradientOpacity: 0.950,
      decimalPlaces: 2,
      color: (opacity = 1) => `rgba(30, 158, 255, ${opacity})`, // Apply the desired color here
      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      style: {
        borderRadius: 16,
      },
    }}
    style={{
      marginVertical: 8,
      borderRadius: 16,
    }}
    yAxisSuffix="KL"
    withVerticalLabels={false} // Set this to false to hide x-axis labels
    fromZero={true}
    decorator={({ x, y, index }) => (
      <TouchableOpacity
        onPress={() =>
          handleTooltipPress(
            barChartData.datasets[0].data[index],
            x,
            y
          )
        }
        key={index}
        style={{
          position: 'absolute',
          left: x - 20,
          top: y - 50,
          alignItems: 'center',
        }}
      >
        <View style={styles.barLabel}>
          <Text style={{ fontSize: 12, color: 'black' }}>
            {barChartData.datasets[0].data[index]} KL
          </Text>
          <Text style={{ fontSize: 12, color: 'black' }}>
            {fetchedData[index]} // Assuming fetchedData is an array containing the fetched data
          </Text>
        </View>
      </TouchableOpacity>
    )}
  />
</View>

   

    <Footer />
  </View>
);
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 0.01 * screenWidth, // Adjusted paddingHorizontal
    backgroundColor: 'white',
    marginTop: 0.07* screenWidth, // Adjusted marginTop
  },
  logoContainer: {
    width: 0.8 * screenWidth, // Adjust the width of the container as needed
    marginRight: -0.70 * screenWidth, // Adjusted marginRight to maintain alignment
    justifyContent: 'flex-end', // Move the logo to the right within the container
    top:30,
    left:10,
  },
    
  logo: {
    width: 0.22 * screenWidth, // Increased width of the logo
    height: 0.15 * screenWidth, // Adjusted height to maintain aspect ratio
    resizeMode: 'contain',
    paddingHorizontal: 0.100,
    position: 'absolute',
  },
  
  
  iconContainer: {
    padding: -0.18* screenWidth, // Adjusted padding
  },
  middleContainer: {
    alignItems: 'center',
  },
  barChartContainer: {
    alignItems: 'center',
    marginTop: 0.12 * screenWidth, // Adjusted marginTop
  },

  chartHeading: {
    fontSize: 0.04 * screenWidth, // Adjusted fontSize
    fontWeight: 'bold',
    marginBottom: 0.029 * screenWidth, // Adjusted marginBottom
  },


  greetingContainer: {
    alignItems: 'center',
    left:-100,
    marginTop: 5, // Adjust the marginTop as needed
  },
  greetingText: {
    fontSize: 18, // Adjust the fontSize as needed
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 16, // Adjust the fontSize as needed
    marginTop: 5,
    left:-20, // Adjust the marginTop as needed
  },
  Flatno: {
    fontSize: 16, // Adjust the fontSize as needed
    textAlign: 'center', // Align text to the center
    left:130,
    color:'#1e9eff',
    fontWeight: 'bold',
  },
  
  
  
  
  todayUsageContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  todayUsageText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 20,
},
image: {
    width: screenWidth * 1, // Adjust the width as per your requirement
    height: 180, // Adjust the height as per your requirement
    resizeMode: 'cover', // Adjust the resizeMode as per your requirement
},

  imageAndExtraImageContainer: {
    flexDirection: 'column', // Change to column direction
    alignItems: 'center',
    
  },
  extraImage: {
    position: 'absolute',
    bottom: 115, // Position at the top of the image container
    left: 250, // Align with the left edge of the container
    width: 30, // Adjust width as needed
    height: 25, // Adjust height as needed
    resizeMode: 'cover', // Adjust the resizeMode as per your requirement
  },
  

  
  chartContainerBorder: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 0.01 * screenWidth, // Adjusted borderRadius
    padding: 0.10 * screenWidth, // Adjusted padding
    width: screenWidth,
  },
  headerText: {
    fontSize: 9 * screenWidth, // Adjusted fontSize
    fontWeight: 'bold',
    color: 'white',
  },
  calendarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0.01 * screenWidth, // Adjusted marginTop
  },
  circleContainer: {
    alignItems: 'center',
    marginRight: 0.09 * screenWidth, // Adjusted marginRight
  },
  circleOutline: {
    borderRadius: 0.9 * screenWidth,
    padding: 0.02 * screenWidth,
    borderWidth: 1,
    borderColor: '#bdbdbd',
},
  circle: {
    width: 0.12 * screenWidth, // Adjusted width
    height: 0.1 * screenWidth, // Adjusted height
    borderRadius: 0.05 * screenWidth, // Adjusted borderRadius
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  dayNumber: {
    color: 'black',
    fontSize: 0.03 * screenWidth, // Adjusted fontSize
    fontWeight: 'bold',
    position: 'absolute',
    top: '30%',
  },
  todayText: {
    marginTop: 0.007 * screenWidth, // Adjusted marginTop
    marginLeft: 0.02 * screenWidth, // Adjusted marginLeft
    fontSize: 0.04 * screenWidth, // Adjusted fontSize
    fontWeight: 'bold',
    color: 'black',
  },
  checkIcon: {
    position: 'absolute',
  },
  weekNumber: {
    color: 'black',
    fontSize: 0.03 * screenWidth, // Adjusted fontSize
    fontWeight: 'bold',
  },
  weekText: {
    marginTop: 0.007 * screenWidth, // Adjusted marginTop
    marginLeft: 0.02 * screenWidth, // Adjusted marginLeft
    fontSize: 0.04 * screenWidth, // Adjusted fontSize
    fontWeight: 'bold',
    color: 'black',
  },
  monthNumber: {
    color: 'black',
    fontSize: 0.03 * screenWidth, // Adjusted fontSize
    fontWeight: 'bold',
  },
  monthText: {
    marginTop: 0.007 * screenWidth, // Adjusted marginTop
    marginLeft: 0.02 * screenWidth, // Adjusted marginLeft
    fontSize: 0.04 * screenWidth, // Adjusted fontSize
    fontWeight: 'bold',
    color: 'black',
  },
  forecastText: {
    marginTop: 0.007 * screenWidth, // Adjusted marginTop
    marginLeft: 0.02 * screenWidth, // Adjusted marginLeft
    fontSize: 0.04 * screenWidth, // Adjusted fontSize
    fontWeight: 'bold',
    color: 'black',
  },
  centerText: {
    flex: 1,
    alignItems: 'center',
  },
  centerTextContent: {
    fontSize: 0.045 * screenWidth, // Adjusted fontSize
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'left',
    maxWidth: 0.5 * screenWidth, // Adjusted maxWidth
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    height: 0.113 * screenWidth, // Adjusted height
  },
  footerIcon: {
    paddingHorizontal: 0.025 * screenWidth, // Adjusted paddingHorizontal
  },
  circleContainer: {
    position: 'relative',
  },
  homeIcon: {
    backgroundColor: '#1e9eff',
    borderRadius: 0.1 * screenWidth, // Adjusted borderRadius
    padding: 0.025 * screenWidth, // Adjusted padding
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 0.02 * screenWidth, // Adjusted marginTop
  },
  card: {
    width: 0.18 * screenWidth, // Adjusted width
    padding: 0.02 * screenWidth, // Adjusted padding
    borderRadius: 0.04 * screenWidth, // Adjusted borderRadius
    alignItems: 'center',
  },
  cardSpacing: {
    marginHorizontal: 0.03 * screenWidth, // Adjusted marginHorizontal
  },
  cardTitle: {
    fontSize: 0.03 * screenWidth, // Adjusted fontSize
    fontWeight: 'bold',
    marginBottom: 0.015 * screenWidth, // Adjusted marginBottom
    color: 'white',
  },
  tooltipContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 0.01 * screenWidth, // Adjusted borderRadius
    padding: 0.005 * screenWidth, // Adjusted padding
    zIndex: 999,
  },

  cardContainer: {
    marginTop: -170, 
    left: 60,
    alignItems: 'flex-start', // Align items to the start of the container
  },
  usageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10, // Adjust as needed
  },
  bulletIcon: {
    marginRight: 5, // Adjust as needed
  },
  icon: {
    marginRight: 10, // Adjust as needed
  },
  usageText: {
    fontWeight: 'bold',
    fontSize: 17,
    marginRight: 5,
    color:'white' // Adjust as needed
  },
  usageValue: {
    fontSize: 16,
    color:'white',
    fontWeight: 'bold',
  },

  
  


  cardData: {
    fontSize: 0.025 * screenWidth, // Adjusted fontSize
    fontWeight: 'bold',
    color: 'white',
  },
});




  
export default HomeScreen;