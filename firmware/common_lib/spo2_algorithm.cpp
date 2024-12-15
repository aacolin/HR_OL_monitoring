/** \file algorithm.cpp ******************************************************
*
* Project: MAXREFDES117#
* Filename: algorithm.cpp
* Description: This module calculates the heart rate/SpO2 level
*
*
* --------------------------------------------------------------------
*
* This code follows the following naming conventions:
*
* char              ch_pmod_value
* char (array)      s_pmod_s_string[16]
* float             f_pmod_value
* int32_t           n_pmod_value
* int32_t (array)   an_pmod_value[16]
* int16_t           w_pmod_value
* int16_t (array)   aw_pmod_value[16]
* uint16_t          uw_pmod_value
* uint16_t (array)  auw_pmod_value[16]
* uint8_t           uch_pmod_value
* uint8_t (array)   auch_pmod_buffer[16]
* uint32_t          un_pmod_value
* int32_t *         pn_pmod_value
*
* ------------------------------------------------------------------------- */
/*******************************************************************************
* Copyright (C) 2016 Ma***REMOVED***im Integrated Products, Inc., All Rights Reserved.
*
* Permission is hereby granted, free of charge, to any person obtaining a
* copy of this software and associated documentation files (the "Software"),
* to deal in the Software without restriction, including without limitation
* the rights to use, copy, modify, merge, publish, distribute, sublicense,
* and/or sell copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included
* in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
* OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
* MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
* IN NO EVENT SHALL MAXIM INTEGRATED BE LIABLE FOR ANY CLAIM, DAMAGES
* OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
* ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*
* E***REMOVED***cept as contained in this notice, the name of Ma***REMOVED***im Integrated
* Products, Inc. shall not be used e***REMOVED***cept as stated in the Ma***REMOVED***im Integrated
* Products, Inc. Branding Policy.
*
* The mere transfer of this software does not imply any licenses
* of trade secrets, proprietary technology, copyrights, patents,
* trademarks, maskwork rights, or any other form of intellectual
* property whatsoever. Ma***REMOVED***im Integrated Products, Inc. retains all
* ownership rights.
*******************************************************************************
*/

#include "Arduino.h"
#include "spo2_algorithm.h"

#if defined(__AVR_ATmega328P__) || defined(__AVR_ATmega168__)
//Arduino Uno doesn't have enough SRAM to store 100 samples of IR led data and red led data in 32-bit format
//To solve this problem, 16-bit MSB of the sampled data will be truncated.  Samples become 16-bit data.
void ma***REMOVED***im_heart_rate_and_o***REMOVED***ygen_saturation(uint16_t *pun_ir_buffer, int32_t n_ir_buffer_length, uint16_t *pun_red_buffer, int32_t *pn_spo2, int8_t *pch_spo2_valid, 
                int32_t *pn_heart_rate, int8_t *pch_hr_valid)
#else
void ma***REMOVED***im_heart_rate_and_o***REMOVED***ygen_saturation(uint32_t *pun_ir_buffer, int32_t n_ir_buffer_length, uint32_t *pun_red_buffer, int32_t *pn_spo2, int8_t *pch_spo2_valid, 
                int32_t *pn_heart_rate, int8_t *pch_hr_valid)
#endif
/**
* \brief        Calculate the heart rate and SpO2 level
* \par          Details
*               By detecting  peaks of PPG cycle and corresponding AC/DC of red/infra-red signal, the an_ratio for the SPO2 is computed.
*               Since this algorithm is aiming for Arm M0/M3. formaula for SPO2 did not achieve the accuracy due to register overflow.
*               Thus, accurate SPO2 is precalculated and save longo uch_spo2_table[] per each an_ratio.
*
* \param[in]    *pun_ir_buffer           - IR sensor data buffer
* \param[in]    n_ir_buffer_length      - IR sensor data buffer length
* \param[in]    *pun_red_buffer          - Red sensor data buffer
* \param[out]    *pn_spo2                - Calculated SpO2 value
* \param[out]    *pch_spo2_valid         - 1 if the calculated SpO2 value is valid
* \param[out]    *pn_heart_rate          - Calculated heart rate value
* \param[out]    *pch_hr_valid           - 1 if the calculated heart rate value is valid
*
* \retval       None
*/
{
  uint32_t un_ir_mean;
  int32_t k, n_i_ratio_count;
  int32_t i, n_e***REMOVED***act_ir_valley_locs_count, n_middle_id***REMOVED***;
  int32_t n_th1, n_npks;   
  int32_t an_ir_valley_locs[15] ;
  int32_t n_peak_interval_sum;
  
  int32_t n_y_ac, n_***REMOVED***_ac;
  int32_t n_spo2_calc; 
  int32_t n_y_dc_ma***REMOVED***, n_***REMOVED***_dc_ma***REMOVED***; 
  int32_t n_y_dc_ma***REMOVED***_id***REMOVED*** = 0;
  int32_t n_***REMOVED***_dc_ma***REMOVED***_id***REMOVED*** = 0; 
  int32_t an_ratio[5], n_ratio_average; 
  int32_t n_nume, n_denom ;

  // calculates DC mean and subtract DC from ir
  un_ir_mean =0; 
  for (k=0 ; k<n_ir_buffer_length ; k++ ) un_ir_mean += pun_ir_buffer[k] ;
  un_ir_mean =un_ir_mean/n_ir_buffer_length ;
    
  // remove DC and invert signal so that we can use peak detector as valley detector
  for (k=0 ; k<n_ir_buffer_length ; k++ )  
    an_***REMOVED***[k] = -1*(pun_ir_buffer[k] - un_ir_mean) ; 
    
  // 4 pt Moving Average
  for(k=0; k< BUFFER_SIZE-MA4_SIZE; k++){
    an_***REMOVED***[k]=( an_***REMOVED***[k]+an_***REMOVED***[k+1]+ an_***REMOVED***[k+2]+ an_***REMOVED***[k+3])/(int)4;        
  }
  // calculate threshold  
  n_th1=0; 
  for ( k=0 ; k<BUFFER_SIZE ;k++){
    n_th1 +=  an_***REMOVED***[k];
  }
  n_th1=  n_th1/ ( BUFFER_SIZE);
  if( n_th1<30) n_th1=30; // min allowed
  if( n_th1>60) n_th1=60; // ma***REMOVED*** allowed

  for ( k=0 ; k<15;k++) an_ir_valley_locs[k]=0;
  // since we flipped signal, we use peak detector as valley detector
  ma***REMOVED***im_find_peaks( an_ir_valley_locs, &n_npks, an_***REMOVED***, BUFFER_SIZE, n_th1, 4, 15 );//peak_height, peak_distance, ma***REMOVED***_num_peaks 
  n_peak_interval_sum =0;
  if (n_npks>=2){
    for (k=1; k<n_npks; k++) n_peak_interval_sum += (an_ir_valley_locs[k] -an_ir_valley_locs[k -1] ) ;
    n_peak_interval_sum =n_peak_interval_sum/(n_npks-1);
    *pn_heart_rate =(int32_t)( (FreqS*60)/ n_peak_interval_sum );
    *pch_hr_valid  = 1;
  }
  else  { 
    *pn_heart_rate = -999; // unable to calculate because # of peaks are too small
    *pch_hr_valid  = 0;
  }

  //  load raw value again for SPO2 calculation : RED(=y) and IR(=X)
  for (k=0 ; k<n_ir_buffer_length ; k++ )  {
      an_***REMOVED***[k] =  pun_ir_buffer[k] ; 
      an_y[k] =  pun_red_buffer[k] ; 
  }

  // find precise min near an_ir_valley_locs
  n_e***REMOVED***act_ir_valley_locs_count =n_npks; 
  
  //using e***REMOVED***act_ir_valley_locs , find ir-red DC andir-red AC for SPO2 calibration an_ratio
  //finding AC/DC ma***REMOVED***imum of raw

  n_ratio_average =0; 
  n_i_ratio_count = 0; 
  for(k=0; k< 5; k++) an_ratio[k]=0;
  for (k=0; k< n_e***REMOVED***act_ir_valley_locs_count; k++){
    if (an_ir_valley_locs[k] > BUFFER_SIZE ){
      *pn_spo2 =  -999 ; // do not use SPO2 since valley loc is out of range
      *pch_spo2_valid  = 0; 
      return;
    }
  }
  // find ma***REMOVED*** between two valley locations 
  // and use an_ratio betwen AC compoent of Ir & Red and DC compoent of Ir & Red for SPO2 
  for (k=0; k< n_e***REMOVED***act_ir_valley_locs_count-1; k++){
    n_y_dc_ma***REMOVED***= -16777216 ; 
    n_***REMOVED***_dc_ma***REMOVED***= -16777216; 
    if (an_ir_valley_locs[k+1]-an_ir_valley_locs[k] >3){
        for (i=an_ir_valley_locs[k]; i< an_ir_valley_locs[k+1]; i++){
          if (an_***REMOVED***[i]> n_***REMOVED***_dc_ma***REMOVED***) {n_***REMOVED***_dc_ma***REMOVED*** =an_***REMOVED***[i]; n_***REMOVED***_dc_ma***REMOVED***_id***REMOVED***=i;}
          if (an_y[i]> n_y_dc_ma***REMOVED***) {n_y_dc_ma***REMOVED*** =an_y[i]; n_y_dc_ma***REMOVED***_id***REMOVED***=i;}
      }
      n_y_ac= (an_y[an_ir_valley_locs[k+1]] - an_y[an_ir_valley_locs[k] ] )*(n_y_dc_ma***REMOVED***_id***REMOVED*** -an_ir_valley_locs[k]); //red
      n_y_ac=  an_y[an_ir_valley_locs[k]] + n_y_ac/ (an_ir_valley_locs[k+1] - an_ir_valley_locs[k])  ; 
      n_y_ac=  an_y[n_y_dc_ma***REMOVED***_id***REMOVED***] - n_y_ac;    // subracting linear DC compoenents from raw 
      n_***REMOVED***_ac= (an_***REMOVED***[an_ir_valley_locs[k+1]] - an_***REMOVED***[an_ir_valley_locs[k] ] )*(n_***REMOVED***_dc_ma***REMOVED***_id***REMOVED*** -an_ir_valley_locs[k]); // ir
      n_***REMOVED***_ac=  an_***REMOVED***[an_ir_valley_locs[k]] + n_***REMOVED***_ac/ (an_ir_valley_locs[k+1] - an_ir_valley_locs[k]); 
      n_***REMOVED***_ac=  an_***REMOVED***[n_y_dc_ma***REMOVED***_id***REMOVED***] - n_***REMOVED***_ac;      // subracting linear DC compoenents from raw 
      n_nume=( n_y_ac *n_***REMOVED***_dc_ma***REMOVED***)>>7 ; //prepare X100 to preserve floating value
      n_denom= ( n_***REMOVED***_ac *n_y_dc_ma***REMOVED***)>>7;
      if (n_denom>0  && n_i_ratio_count <5 &&  n_nume != 0)
      {   
        an_ratio[n_i_ratio_count]= (n_nume*100)/n_denom ; //formular is ( n_y_ac *n_***REMOVED***_dc_ma***REMOVED***) / ( n_***REMOVED***_ac *n_y_dc_ma***REMOVED***) ;
        n_i_ratio_count++;
      }
    }
  }
  // choose median value since PPG signal may varies from beat to beat
  ma***REMOVED***im_sort_ascend(an_ratio, n_i_ratio_count);
  n_middle_id***REMOVED***= n_i_ratio_count/2;

  if (n_middle_id***REMOVED*** >1)
    n_ratio_average =( an_ratio[n_middle_id***REMOVED***-1] +an_ratio[n_middle_id***REMOVED***])/2; // use median
  else
    n_ratio_average = an_ratio[n_middle_id***REMOVED*** ];

  if( n_ratio_average>2 && n_ratio_average <184){
    n_spo2_calc= uch_spo2_table[n_ratio_average] ;
    *pn_spo2 = n_spo2_calc ;
    *pch_spo2_valid  = 1;//  float_SPO2 =  -45.060*n_ratio_average* n_ratio_average/10000 + 30.354 *n_ratio_average/100 + 94.845 ;  // for comparison with table
  }
  else{
    *pn_spo2 =  -999 ; // do not use SPO2 since signal an_ratio is out of range
    *pch_spo2_valid  = 0; 
  }
}


void ma***REMOVED***im_find_peaks( int32_t *pn_locs, int32_t *n_npks,  int32_t  *pn_***REMOVED***, int32_t n_size, int32_t n_min_height, int32_t n_min_distance, int32_t n_ma***REMOVED***_num )
/**
* \brief        Find peaks
* \par          Details
*               Find at most MAX_NUM peaks above MIN_HEIGHT separated by at least MIN_DISTANCE
*
* \retval       None
*/
{
  ma***REMOVED***im_peaks_above_min_height( pn_locs, n_npks, pn_***REMOVED***, n_size, n_min_height );
  ma***REMOVED***im_remove_close_peaks( pn_locs, n_npks, pn_***REMOVED***, n_min_distance );
  *n_npks = min( *n_npks, n_ma***REMOVED***_num );
}

void ma***REMOVED***im_peaks_above_min_height( int32_t *pn_locs, int32_t *n_npks,  int32_t  *pn_***REMOVED***, int32_t n_size, int32_t n_min_height )
/**
* \brief        Find peaks above n_min_height
* \par          Details
*               Find all peaks above MIN_HEIGHT
*
* \retval       None
*/
{
  int32_t i = 1, n_width;
  *n_npks = 0;
  
  while (i < n_size-1){
    if (pn_***REMOVED***[i] > n_min_height && pn_***REMOVED***[i] > pn_***REMOVED***[i-1]){      // find left edge of potential peaks
      n_width = 1;
      while (i+n_width < n_size && pn_***REMOVED***[i] == pn_***REMOVED***[i+n_width])  // find flat peaks
        n_width++;
      if (pn_***REMOVED***[i] > pn_***REMOVED***[i+n_width] && (*n_npks) < 15 ){      // find right edge of peaks
        pn_locs[(*n_npks)++] = i;    
        // for flat peaks, peak location is left edge
        i += n_width+1;
      }
      else
        i += n_width;
    }
    else
      i++;
  }
}

void ma***REMOVED***im_remove_close_peaks(int32_t *pn_locs, int32_t *pn_npks, int32_t *pn_***REMOVED***, int32_t n_min_distance)
/**
* \brief        Remove peaks
* \par          Details
*               Remove peaks separated by less than MIN_DISTANCE
*
* \retval       None
*/
{
    
  int32_t i, j, n_old_npks, n_dist;
    
  /* Order peaks from large to small */
  ma***REMOVED***im_sort_indices_descend( pn_***REMOVED***, pn_locs, *pn_npks );

  for ( i = -1; i < *pn_npks; i++ ){
    n_old_npks = *pn_npks;
    *pn_npks = i+1;
    for ( j = i+1; j < n_old_npks; j++ ){
      n_dist =  pn_locs[j] - ( i == -1 ? -1 : pn_locs[i] ); // lag-zero peak of autocorr is at inde***REMOVED*** -1
      if ( n_dist > n_min_distance || n_dist < -n_min_distance )
        pn_locs[(*pn_npks)++] = pn_locs[j];
    }
  }

  // Resort indices int32_to ascending order
  ma***REMOVED***im_sort_ascend( pn_locs, *pn_npks );
}

void ma***REMOVED***im_sort_ascend(int32_t  *pn_***REMOVED***, int32_t n_size) 
/**
* \brief        Sort array
* \par          Details
*               Sort array in ascending order (insertion sort algorithm)
*
* \retval       None
*/
{
  int32_t i, j, n_temp;
  for (i = 1; i < n_size; i++) {
    n_temp = pn_***REMOVED***[i];
    for (j = i; j > 0 && n_temp < pn_***REMOVED***[j-1]; j--)
        pn_***REMOVED***[j] = pn_***REMOVED***[j-1];
    pn_***REMOVED***[j] = n_temp;
  }
}

void ma***REMOVED***im_sort_indices_descend(  int32_t  *pn_***REMOVED***, int32_t *pn_ind***REMOVED***, int32_t n_size)
/**
* \brief        Sort indices
* \par          Details
*               Sort indices according to descending order (insertion sort algorithm)
*
* \retval       None
*/ 
{
  int32_t i, j, n_temp;
  for (i = 1; i < n_size; i++) {
    n_temp = pn_ind***REMOVED***[i];
    for (j = i; j > 0 && pn_***REMOVED***[n_temp] > pn_***REMOVED***[pn_ind***REMOVED***[j-1]]; j--)
      pn_ind***REMOVED***[j] = pn_ind***REMOVED***[j-1];
    pn_ind***REMOVED***[j] = n_temp;
  }
}




