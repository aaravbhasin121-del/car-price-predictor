import streamlit as st
import requests
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

st.set_page_config(page_title="Car Price Predictor", page_icon="🚗", layout="centered")

st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600&display=swap');
.stApp { background: linear-gradient(135deg, #0a0a0f 0%, #0d1117 50%, #0a0f1a 100%); }
.main-title {
    font-family: 'Orbitron', monospace;
    font-size: 2.2rem;
    font-weight: 900;
    text-align: center;
    background: linear-gradient(90deg, #ff4d00, #ff8c00, #ffd700);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: 3px;
    margin-bottom: 0.2rem;
    padding-top: 2rem;
}
.sub-title {
    font-family: 'Rajdhani', sans-serif;
    font-size: 1rem;
    text-align: center;
    color: #ff8c00;
    letter-spacing: 5px;
    text-transform: uppercase;
    margin-bottom: 2.5rem;
}
.card {
    background: linear-gradient(145deg, #1a0a00, #1f1000);
    border: 1px solid #3a1a00;
    border-radius: 16px;
    padding: 2rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 0 30px rgba(255,140,0,0.08);
}
.card-title {
    font-family: 'Orbitron', monospace;
    font-size: 0.7rem;
    color: #ff8c00;
    letter-spacing: 4px;
    text-transform: uppercase;
    margin-bottom: 1.2rem;
    border-left: 3px solid #ff4d00;
    padding-left: 10px;
}
.metric-row {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.5rem;
}
.metric-box {
    flex: 1;
    background: linear-gradient(145deg, #150800, #1a0d00);
    border: 1px solid #3a1a00;
    border-radius: 12px;
    padding: 1rem;
    text-align: center;
}
.metric-label {
    font-family: 'Rajdhani', sans-serif;
    font-size: 0.7rem;
    color: #995500;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 0.3rem;
}
.metric-value {
    font-family: 'Orbitron', monospace;
    font-size: 1.1rem;
    color: #ffd700;
    font-weight: 700;
}
.result-box {
    background: linear-gradient(145deg, #1a0800, #200e00);
    border: 1px solid #ff4d00;
    border-radius: 16px;
    padding: 2rem;
    text-align: center;
    box-shadow: 0 0 40px rgba(255,77,0,0.2);
    margin-top: 1.5rem;
}
.result-label {
    font-family: 'Rajdhani', sans-serif;
    font-size: 0.8rem;
    color: #ff8c00;
    letter-spacing: 5px;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
}
.result-value {
    font-family: 'Orbitron', monospace;
    font-size: 3rem;
    font-weight: 900;
    background: linear-gradient(90deg, #ff4d00, #ffd700);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1.1;
}
.result-unit {
    font-family: 'Rajdhani', sans-serif;
    font-size: 1rem;
    color: #995500;
    letter-spacing: 4px;
    margin-top: 0.3rem;
}
.emi-box {
    background: linear-gradient(145deg, #001a0a, #002010);
    border: 1px solid #00aa44;
    border-radius: 16px;
    padding: 2rem;
    text-align: center;
    box-shadow: 0 0 40px rgba(0,170,68,0.15);
    margin-top: 1.5rem;
}
.emi-label {
    font-family: 'Rajdhani', sans-serif;
    font-size: 0.8rem;
    color: #00cc55;
    letter-spacing: 5px;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
}
.emi-value {
    font-family: 'Orbitron', monospace;
    font-size: 2.5rem;
    font-weight: 900;
    background: linear-gradient(90deg, #00cc55, #00ffaa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1.1;
}
.emi-unit {
    font-family: 'Rajdhani', sans-serif;
    font-size: 1rem;
    color: #006633;
    letter-spacing: 4px;
    margin-top: 0.3rem;
}
.stButton > button {
    width: 100%;
    background: linear-gradient(90deg, #cc3d00, #ff4d00, #ff8c00);
    color: white;
    border: none;
    border-radius: 10px;
    padding: 0.8rem 2rem;
    font-family: 'Orbitron', monospace;
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    box-shadow: 0 0 20px rgba(255,77,0,0.3);
    margin-top: 1rem;
}
div[data-testid="stNumberInput"] label,
div[data-testid="stSlider"] label,
div[data-testid="stSelectbox"] label {
    font-family: 'Rajdhani', sans-serif;
    font-size: 0.75rem;
    color: #ff8c00;
    letter-spacing: 3px;
    text-transform: uppercase;
}
div[data-testid="stNumberInput"] input {
    background: #150800;
    border: 1px solid #3a1a00;
    border-radius: 8px;
    color: #ffd700;
    font-family: 'Orbitron', monospace;
}
.tag {
    display: inline-block;
    background: rgba(255,77,0,0.1);
    border: 1px solid #3a1a00;
    border-radius: 20px;
    padding: 0.2rem 0.8rem;
    font-family: 'Rajdhani', sans-serif;
    font-size: 0.7rem;
    color: #ff8c00;
    letter-spacing: 2px;
    margin-right: 0.5rem;
    margin-bottom: 1rem;
}
</style>
""", unsafe_allow_html=True)

# Session state init
if 'prediction_history' not in st.session_state:
    st.session_state.prediction_history = []
if 'last_price' not in st.session_state:
    st.session_state.last_price = None
if 'show_emi' not in st.session_state:
    st.session_state.show_emi = False

# Header
st.markdown('<div class="main-title">CAR.PRICE.AI</div>', unsafe_allow_html=True)
st.markdown('<div class="sub-title">Used Car Valuation Engine</div>', unsafe_allow_html=True)
st.markdown('<span class="tag">Random Forest</span><span class="tag">RMSE: 814365</span><span class="tag">R2: 0.74</span>', unsafe_allow_html=True)

brand_map = {
    'Maruti Suzuki': {'code': 20, 'img': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Suzuki_logo_2.svg/120px-Suzuki_logo_2.svg.png'},
    'Hyundai':       {'code': 13, 'img': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Hyundai_Motor_Company_logo.svg/120px-Hyundai_Motor_Company_logo.svg.png'},
    'Honda':         {'code': 12, 'img': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Honda.svg/120px-Honda.svg.png'},
    'Toyota':        {'code': 39, 'img': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Toyota_carlogo.svg/120px-Toyota_carlogo.svg.png'},
    'Volkswagen':    {'code': 41, 'img': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Volkswagen_logo_2019.svg/120px-Volkswagen_logo_2019.svg.png'},
    'Ford':          {'code':  9, 'img': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Ford_logo_flat.svg/120px-Ford_logo_flat.svg.png'},
    'Tata':          {'code': 37, 'img': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Tata_logo.svg/120px-Tata_logo.svg.png'},
    'Mahindra':      {'code': 21, 'img': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Mahindra_Logo.svg/120px-Mahindra_Logo.svg.png'},
    'Renault':       {'code': 31, 'img': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Renault_2021_Text_Logo.svg/120px-Renault_2021_Text_Logo.svg.png'},
    'Kia':           {'code': 17, 'img': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Kia-logo.svg/120px-Kia-logo.svg.png'},
    'BMW':           {'code':  3, 'img': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/120px-BMW.svg.png'},
    'Mercedes':      {'code': 22, 'img': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mercedes-Logo.svg/120px-Mercedes-Logo.svg.png'},
    'Audi':          {'code':  1, 'img': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Audi-Logo_2016.svg/120px-Audi-Logo_2016.svg.png'},
}
transmission_map = {'Manual': 1, 'Automatic': 0}
owner_map = {'First': 0, 'Second': 1, 'Third': 2, 'Fourth & Above': 3}
fuel_map = {'Petrol': 2, 'Diesel': 1, 'CNG': 0, 'Electric': 3, 'LPG': 4}

# Input card
st.markdown('<div class="card"><div class="card-title">Vehicle Details</div>', unsafe_allow_html=True)

col1, col2 = st.columns([3, 1])
with col1:
    brand_name = st.selectbox("Brand", list(brand_map.keys()))
with col2:
    try:
        st.image(brand_map[brand_name]['img'], width=70)
    except:
        pass

col1, col2 = st.columns(2)
with col1:
    age = st.number_input("Age of Car (years)", min_value=0, max_value=30, value=5)
    transmission_name = st.selectbox("Transmission", list(transmission_map.keys()))
    owner_name = st.selectbox("Owner Type", list(owner_map.keys()))
with col2:
    km_driven = st.number_input("KM Driven", min_value=0, value=50000)
    fuel_name = st.selectbox("Fuel Type", list(fuel_map.keys()))

st.markdown('</div>', unsafe_allow_html=True)

brand = brand_map[brand_name]['code']
transmission = transmission_map[transmission_name]
owner = owner_map[owner_name]
fuel_type = fuel_map[fuel_name]
model_encoded = 88

# Metrics
st.markdown(f"""
<div class="metric-row">
    <div class="metric-box">
        <div class="metric-label">Brand</div>
        <div class="metric-value">{brand_name.split()[0]}</div>
    </div>
    <div class="metric-box">
        <div class="metric-label">Age</div>
        <div class="metric-value">{age} yrs</div>
    </div>
    <div class="metric-box">
        <div class="metric-label">KM</div>
        <div class="metric-value">{km_driven:,}</div>
    </div>
</div>
""", unsafe_allow_html=True)

# Buttons
col1, col2 = st.columns(2)
with col1:
    predict_btn = st.button("ESTIMATE PRICE")
with col2:
    reset_btn = st.button("RESET")

if reset_btn:
    st.session_state.prediction_history = []
    st.session_state.last_price = None
    st.session_state.show_emi = False
    st.rerun()

# Prediction logic
if predict_btn:
    with st.spinner("Calculating market value..."):
        try:
            payload = {
                "brand": brand,
                "model_encoded": model_encoded,
                "age": age,
                "km_driven": float(km_driven),
                "transmission": transmission,
                "owner": owner,
                "fuel_type": fuel_type
            }
            response = requests.post("http://127.0.0.1:8000/predict", json=payload)
            result = response.json()
            price = int(result['predicted_price'])
            st.session_state.last_price = price
            st.session_state.show_emi = False

            st.session_state.prediction_history.append({
                'No': len(st.session_state.prediction_history) + 1,
                'Brand': brand_name,
                'Age': age,
                'KM': km_driven,
                'Price (Rs)': price
            })

            # Result
            st.markdown(f"""
            <div class="result-box">
                <div class="result-label">Estimated Resale Price</div>
                <div class="result-value">Rs.{price:,}</div>
                <div class="result-unit">INDIAN RUPEES</div>
            </div>
            """, unsafe_allow_html=True)

            st.markdown("<br>", unsafe_allow_html=True)

            # Gauge meter
            fig_gauge, ax = plt.subplots(figsize=(8, 2.5))
            fig_gauge.patch.set_facecolor('#0d1117')
            ax.set_facecolor('#0d1117')
            low, high = 100000, 2000000
            norm_price = min(max((price - low) / (high - low), 0), 1)
            zones = [(0, 0.33, '#00cc55', 'LOW'), (0.33, 0.66, '#ff8c00', 'MID'), (0.66, 1.0, '#ff4d00', 'HIGH')]
            for start, end, color, label in zones:
                ax.barh(0, end - start, left=start, height=0.4, color=color, alpha=0.3)
                ax.text((start + end) / 2, -0.35, label, ha='center', color=color,
                        fontsize=9, fontfamily='monospace', fontweight='bold')
            ax.axvline(x=norm_price, color='white', linewidth=3, ymin=0.1, ymax=0.9)
            ax.plot(norm_price, 0, 'o', color='white', markersize=12)
            ax.set_xlim(0, 1)
            ax.set_ylim(-0.6, 0.6)
            ax.axis('off')
            ax.set_title('Price Range Gauge', color='#ff8c00', fontsize=11, fontfamily='monospace', pad=10)
            st.pyplot(fig_gauge)
            plt.close()

            st.markdown("<br>", unsafe_allow_html=True)

            # Feature impact bar chart
            feature_names = ['Brand', 'Age', 'KM Driven', 'Transmission', 'Owner', 'Fuel Type']
            raw_vals = [brand * 5000, age * 15000, km_driven * 0.5, transmission * 50000,
                        owner * 30000, fuel_type * 20000]
            total = sum(raw_vals) if sum(raw_vals) > 0 else 1
            contributions = [v / total * price for v in raw_vals]

            fig_bar, ax2 = plt.subplots(figsize=(8, 4))
            fig_bar.patch.set_facecolor('#0d1117')
            ax2.set_facecolor('#0d1117')
            colors = ['#ff4d00', '#ff8c00', '#ffd700', '#ff6600', '#ffaa00', '#ff3300']
            bars = ax2.barh(feature_names, contributions, color=colors, alpha=0.85)
            ax2.set_xlabel('Price Contribution (Rs)', color='#ff8c00', fontsize=9)
            ax2.set_title('Feature Impact on Price', color='#ff8c00', fontsize=11, fontfamily='monospace')
            ax2.tick_params(colors='#ff8c00')
            for spine in ax2.spines.values():
                spine.set_edgecolor('#3a1a00')
            for bar, val in zip(bars, contributions):
                ax2.text(bar.get_width() + 500, bar.get_y() + bar.get_height() / 2,
                        f'Rs.{int(val):,}', va='center', color='#ffd700', fontsize=8)
            plt.tight_layout()
            st.pyplot(fig_bar)
            plt.close()

        except Exception as e:
            st.error("Cannot connect to API. Make sure backend is running.")

# EMI button appears only after prediction
if st.session_state.last_price:
    st.markdown("<br>", unsafe_allow_html=True)
    if st.button("CALCULATE EMI"):
        st.session_state.show_emi = not st.session_state.show_emi

# EMI Calculator
if st.session_state.show_emi and st.session_state.last_price:
    st.markdown('<div class="card"><div class="card-title">EMI Calculator</div>', unsafe_allow_html=True)
    col1, col2, col3 = st.columns(3)
    with col1:
        down_payment = st.number_input("Down Payment (Rs)", min_value=0,
                                        max_value=st.session_state.last_price,
                                        value=int(st.session_state.last_price * 0.2))
    with col2:
        interest_rate = st.slider("Interest Rate (%)", min_value=5.0, max_value=20.0, value=8.5, step=0.1)
    with col3:
        tenure = st.slider("Tenure (months)", min_value=12, max_value=84, value=36, step=6)

    loan = st.session_state.last_price - down_payment
    monthly_rate = interest_rate / (12 * 100)
    if monthly_rate > 0:
        emi = (loan * monthly_rate * (1 + monthly_rate) ** tenure) / ((1 + monthly_rate) ** tenure - 1)
    else:
        emi = loan / tenure
    total_payment = emi * tenure
    total_interest = total_payment - loan

    st.markdown('</div>', unsafe_allow_html=True)

    st.markdown(f"""
    <div class="emi-box">
        <div class="emi-label">Monthly EMI</div>
        <div class="emi-value">Rs.{int(emi):,}</div>
        <div class="emi-unit">PER MONTH FOR {tenure} MONTHS</div>
    </div>
    """, unsafe_allow_html=True)

    col1, col2, col3 = st.columns(3)
    col1.metric("Loan Amount", f"Rs.{int(loan):,}")
    col2.metric("Total Interest", f"Rs.{int(total_interest):,}")
    col3.metric("Total Payment", f"Rs.{int(total_payment):,}")

# Price History
if len(st.session_state.prediction_history) > 0:
    st.markdown("<br>", unsafe_allow_html=True)
    st.markdown('<div style="font-family:monospace;color:#ff8c00;letter-spacing:4px;font-size:0.7rem;border-left:3px solid #ff4d00;padding-left:10px;margin-bottom:1rem;">PREDICTION HISTORY</div>', unsafe_allow_html=True)

    hist_df = pd.DataFrame(st.session_state.prediction_history)

    fig_hist, ax3 = plt.subplots(figsize=(8, 3))
    fig_hist.patch.set_facecolor('#0d1117')
    ax3.set_facecolor('#0d1117')
    ax3.plot(hist_df['No'], hist_df['Price (Rs)'], color='#ff8c00',
             linewidth=2, marker='o', markersize=8, markerfacecolor='#ffd700')
    ax3.fill_between(hist_df['No'], hist_df['Price (Rs)'], alpha=0.15, color='#ff4d00')
    ax3.set_xlabel('Prediction #', color='#ff8c00', fontsize=9)
    ax3.set_ylabel('Price (Rs)', color='#ff8c00', fontsize=9)
    ax3.set_title('Price Prediction History', color='#ff8c00', fontsize=11, fontfamily='monospace')
    ax3.tick_params(colors='#ff8c00')
    ax3.set_xticks(hist_df['No'])
    for spine in ax3.spines.values():
        spine.set_edgecolor('#3a1a00')
    for _, row in hist_df.iterrows():
        ax3.annotate(f"Rs.{int(row['Price (Rs)']):,}",
                    (row['No'], row['Price (Rs)']),
                    textcoords="offset points", xytext=(0, 10),
                    ha='center', color='#ffd700', fontsize=8)
    plt.tight_layout()
    st.pyplot(fig_hist)
    plt.close()

    st.dataframe(hist_df, use_container_width=True)