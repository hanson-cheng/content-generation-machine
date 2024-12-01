# fal.ai API Pricing

## Current Rates

### Image Generation Models
| Model | Resolution/Options | Cost per Request |
|-------|-------------------|------------------|
| FLUX Pro v1.1 | 512x512 | $0.02 |
| | 768x768 | $0.03 |
| | 1024x1024 | $0.04 |
| FLUX Realism | 512x512 | $0.03 |
| | 768x768 | $0.04 |
| | 1024x1024 | $0.05 |
| FLUX Subject | Base Resolution | $0.04 |
| | With Reference Image | +$0.01 |
| Recraft V3 | Style Creation | $0.10 |
| | Image Generation | $0.03 |

### Audio Generation
| Model | Duration | Cost |
|-------|----------|------|
| F5 TTS | Per 30 seconds | $0.02 |
| | Per minute | $0.03 |
| Stable Audio | Per 30 seconds | $0.05 |
| | Per minute | $0.08 |

### Training & Fine-tuning
| Model | Operation | Cost |
|-------|-----------|------|
| FLUX LoRA Portrait | Training (2000 steps) | $2.00 |
| | Fine-tuning | $1.00 |
| | Generation with Custom Model | $0.04 |

## Volume Discounts
- 1,000-5,000 requests/month: 5% discount
- 5,001-10,000 requests/month: 10% discount
- 10,001+ requests/month: Contact for enterprise pricing

## Usage Optimization

### Cost-Effective Strategies
1. **Batch Processing**
   - Group similar requests
   - Use async processing
   - Implement request queuing

2. **Resolution Management**
   - Start with lower resolutions for drafts
   - Use higher resolutions only for final output
   - Consider target platform requirements

3. **Model Selection**
   - Use base models for initial testing
   - Reserve fine-tuned models for production
   - Consider cost vs. quality trade-offs

4. **Caching Implementation**
   - Cache frequently requested outputs
   - Store intermediate results
   - Implement TTL-based invalidation

## Usage Monitoring

### Tracking Tools
1. **Dashboard Metrics**
   - Real-time usage statistics
   - Cost breakdown by model
   - Usage trends and patterns

2. **Alert System**
   - Usage threshold notifications
   - Budget limit warnings
   - API rate limit alerts

3. **Reporting**
   - Daily/Weekly summaries
   - Cost allocation reports
   - Usage optimization suggestions

## Billing Policies

### Payment Terms
- Monthly billing cycle
- Net 30 payment terms
- Volume discount application
- Enterprise custom terms available

### Usage Calculation
- Per-request billing
- Rounded to nearest unit
- Volume discounts applied automatically
- Unused credits do not roll over

### Rate Protection
- 30-day notice for rate changes
- Grandfathered rates for existing contracts
- Price protection for prepaid credits

## Best Practices

### Cost Management
1. **Development Phase**
   - Use lower resolutions
   - Implement strict rate limiting
   - Enable detailed logging

2. **Production Phase**
   - Optimize request batching
   - Implement caching strategies
   - Monitor usage patterns

3. **Enterprise Scale**
   - Custom volume agreements
   - Dedicated support channels
   - Priority queue access

## Support & Resources
- API usage documentation
- Cost calculator tools
- Integration examples
- Technical support contacts
