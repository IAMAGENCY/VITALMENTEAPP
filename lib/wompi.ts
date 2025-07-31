// Configuración de Wompi Colombia para pagos recurrentes
export const WOMPI_CONFIG = {
  PUBLIC_KEY: 'pub_test_QhSKy4cOaOhqPBUeOi2uwyhhzIqTdSJr',
  PRIVATE_KEY: 'prv_test_tYWFGmcbSuJJhRjLGFNPm4sMtPgKz8Nx', 
  BASE_URL: 'https://production.wompi.co/v1',
  WEBHOOK_URL: 'https://vitalmente.vercel.app/api/webhooks/wompi',
  CURRENCY: 'COP',
  MONTHLY_PRICE: 4500000, // $45,000 COP en centavos
  SUBSCRIPTION_TYPE: 'premium'
};

export interface WompiPaymentData {
  amount_in_cents: number;
  currency: string;
  customer_email: string;
  reference: string;
  public_key: string;
  redirect_url: string;
  payment_method?: {
    type: 'NEQUI' | 'PSE' | 'CARD';
    user_type?: '0' | '1'; // 0 = Persona Natural, 1 = Persona Jurídica (solo PSE)
    user_legal_id_type?: 'CC' | 'CE' | 'NIT';
    user_legal_id?: string;
    financial_institution_code?: string;
  };
  customer_data?: {
    phone_number?: string;
    full_name?: string;
    legal_id?: string;
    legal_id_type?: 'CC' | 'CE' | 'NIT';
  };
}

export interface WompiTransaction {
  id: string;
  amount_in_cents: number;
  reference: string;
  customer_email: string;
  currency: string;
  payment_method: {
    type: string;
    extra: any;
  };
  status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'ERROR' | 'VOIDED';
  status_message: string;
  created_at: string;
  finalized_at?: string;
  shipping_address?: any;
  payment_link_id?: string;
  payment_source_id?: string;
}

export class WompiService {
  private publicKey: string;
  private privateKey: string;
  
  constructor() {
    this.publicKey = WOMPI_CONFIG.PUBLIC_KEY;
    this.privateKey = WOMPI_CONFIG.PRIVATE_KEY;
  }

  // Crear formulario de pago para suscripción
  createSubscriptionCheckout(userId: string, userEmail: string, userName: string): WompiPaymentData {
    return {
      amount_in_cents: WOMPI_CONFIG.MONTHLY_PRICE,
      currency: WOMPI_CONFIG.CURRENCY,
      customer_email: userEmail,
      reference: userId, // Usamos el userId como referencia
      public_key: this.publicKey,
      redirect_url: `${window.location.origin}/suscripcion/confirmacion`,
      customer_data: {
        full_name: userName,
        phone_number: '+57',
        legal_id_type: 'CC'
      }
    };
  }

  // Crear transacción con tarjeta
  async createTransaction(paymentData: WompiPaymentData): Promise<WompiTransaction> {
    try {
      const response = await fetch(`${WOMPI_CONFIG.BASE_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.privateKey}`
        },
        body: JSON.stringify(paymentData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.messages?.join(', ') || 'Error en la transacción');
      }

      return data.data;
    } catch (error) {
      console.error('Error creando transacción Wompi:', error);
      throw error;
    }
  }

  // Consultar estado de transacción
  async getTransaction(transactionId: string): Promise<WompiTransaction> {
    try {
      const response = await fetch(`${WOMPI_CONFIG.BASE_URL}/transactions/${transactionId}`, {
        headers: {
          'Authorization': `Bearer ${this.privateKey}`
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.messages?.join(', ') || 'Error consultando transacción');
      }

      return data.data;
    } catch (error) {
      console.error('Error consultando transacción Wompi:', error);
      throw error;
    }
  }

  // Crear token de pago para renovación automática
  async createPaymentSource(cardData: any, customerEmail: string): Promise<string> {
    try {
      const response = await fetch(`${WOMPI_CONFIG.BASE_URL}/payment_sources`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.privateKey}`
        },
        body: JSON.stringify({
          type: 'CARD',
          token: cardData.token, // Token tokenizado del frontend
          customer_email: customerEmail,
          acceptance_token: cardData.acceptance_token
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.messages?.join(', ') || 'Error creando fuente de pago');
      }

      return data.data.id;
    } catch (error) {
      console.error('Error creando fuente de pago:', error);
      throw error;
    }
  }

  // Procesar pago recurrente
  async processRecurringPayment(paymentSourceId: string, userId: string, userEmail: string): Promise<WompiTransaction> {
    try {
      const paymentData = {
        amount_in_cents: WOMPI_CONFIG.MONTHLY_PRICE,
        currency: WOMPI_CONFIG.CURRENCY,
        customer_email: userEmail,
        reference: `${userId}-${Date.now()}`,
        payment_source_id: paymentSourceId
      };

      return await this.createTransaction(paymentData);
    } catch (error) {
      console.error('Error en pago recurrente:', error);
      throw error;
    }
  }

  // Obtener instituciones financieras para PSE
  async getFinancialInstitutions(): Promise<any[]> {
    try {
      const response = await fetch(`${WOMPI_CONFIG.BASE_URL}/pse/financial_institutions`, {
        headers: {
          'Authorization': `Bearer ${this.publicKey}`
        }
      });

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error obteniendo instituciones financieras:', error);
      return [];
    }
  }

  // Validar integridad de webhook
  validateWebhookSignature(payload: string, signature: string, timestamp: string): boolean {
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', this.privateKey)
      .update(payload + timestamp)
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  }

  // Formatear precio para mostrar
  static formatPrice(amountInCents: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amountInCents / 100);
  }
}

// Instancia singleton
export const wompiService = new WompiService();

// Utilidades para el frontend
export const WompiUtils = {
  // Cargar script de Wompi
  loadWompiScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window !== 'undefined' && (window as any).WidgetCheckout) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.wompi.co/widget.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Error cargando script de Wompi'));
      document.head.appendChild(script);
    });
  },

  // Inicializar widget de checkout
  initCheckout(config: WompiPaymentData, onSuccess: (transaction: any) => void, onError: (error: any) => void) {
    this.loadWompiScript().then(() => {
      const checkout = new (window as any).WidgetCheckout({
        currency: config.currency,
        amountInCents: config.amount_in_cents,
        reference: config.reference,
        publicKey: config.public_key,
        redirectUrl: config.redirect_url,
        customerData: config.customer_data
      });

      checkout.open((result: any) => {
        if (result.transaction && result.transaction.status === 'APPROVED') {
          onSuccess(result.transaction);
        } else {
          onError(result);
        }
      });
    }).catch(onError);
  }
};