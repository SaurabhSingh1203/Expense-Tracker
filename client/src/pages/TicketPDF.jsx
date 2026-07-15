import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#F8FAFC",
  },

  header: {
    backgroundColor: "#4F46E5",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },

  heading: {
    color: "#fff",
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
  },

  image: {
    width: "100%",
    height: 180,
    objectFit: "cover",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    border: "1px solid #ddd",
  },

  row: {
    marginBottom: 8,
    fontSize: 12,
  },
});

const TicketPDF = ({ booking, user }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.heading}>OurEvents Ticket</Text>
      </View>

      <Image src={booking.eventId.image} style={styles.image} />

      <View style={styles.card}>
        <Text style={styles.row}>Event : {booking.eventId.title}</Text>
        <Text style={styles.row}>
          Description : {booking.eventId.description}
        </Text>

        <Text style={styles.row}>
          Date : {new Date(booking.eventId.date).toLocaleString()}
        </Text>

        <Text style={styles.row}>
          Location : {booking.eventId.location}
        </Text>

        <Text style={styles.row}>
          Seat No : {booking.seatNumber}
        </Text>

        <Text style={styles.row}>
          Price : ₹{booking.amount}
        </Text>

        <Text style={styles.row}>
          Status : {booking.status}
        </Text>

        <Text style={styles.row}>
          Name : {user.name}
        </Text>

        <Text style={styles.row}>
          Email : {user.email}
        </Text>
      </View>
    </Page>
  </Document>
);

export default TicketPDF;