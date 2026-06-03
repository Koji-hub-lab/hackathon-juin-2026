package com.example.hackathon.service;

import com.example.hackathon.dto.AlertProductDto;
import com.example.hackathon.dto.DashboardSummaryDto;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

	public DashboardSummaryDto getSummary() {
		throw new UnsupportedOperationException("Not implemented yet");
	}

	public List<AlertProductDto> getAlerts() {
		throw new UnsupportedOperationException("Not implemented yet");
	}
}
