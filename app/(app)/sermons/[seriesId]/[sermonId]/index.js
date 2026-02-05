export default function SermonDetail() {
	return (
		<ScrollView
			style={{ flex: 1, backgroundColor: '#fff' }}
			contentContainerStyle={{ padding: 16 }}
		>
			<Text style={{ fontSize: 20, fontWeight: '700', color: '#000' }}>
				Sermon Title
			</Text>
			<Text style={{ fontSize: 16, color: '#666', marginTop: 8 }}>
				Speaker Name
			</Text>
			<Text style={{ fontSize: 14, color: '#333', marginTop: 16 }}>
				Sermon Summary
			</Text>
			<View style={{ marginTop: 24 }}>
				<Text style={{ fontSize: 16, fontWeight: '700', color: '#000' }}>
					Key Points
				</Text>
				<Text style={{ fontSize: 14, color: '#333', marginTop: 8 }}>
					• Key Point 1
				</Text>
				<Text style={{ fontSize: 14, color: '#333', marginTop: 8 }}>
					• Key Point 2
				</Text>
			</View>
			<View style={{ marginTop: 24 }}>
				<Text style={{ fontSize: 16, fontWeight: '700', color: '#000' }}>
					Verses
				</Text>
				<Text style={{ fontSize: 14, color: '#333', marginTop: 8 }}>
					Verse 1
				</Text>
				<Text style={{ fontSize: 14, color: '#333', marginTop: 8 }}>
					Verse 2
				</Text>
			</View>
		</ScrollView>
	);
}
